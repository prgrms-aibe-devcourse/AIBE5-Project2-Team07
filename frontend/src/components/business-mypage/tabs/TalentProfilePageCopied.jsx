import React, { useEffect, useState } from 'react';
import { decideBusinessApplication } from '../../../services/applyApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const BUSINESS_TYPE_LABELS = {
  FOOD_RESTAURANT: '외식(음식점)',
  CAFE: '카페',
  RETAIL_STORE: '매장관리·판매',
  SERVICE: '서비스',
  DELIVERY_DRIVER: '운전·배달',
  MANUAL_LABOR: '현장단순노무',
};

const initialTalentData = {
  photo: '',
  name: '',
  birthDate: '',
  age: null,
  address: '',
  gender: '',
  phone: '',
  email: '',
  education: null,
  careers: [],
  certificates: [],
  preferredLocations: [],
  preferredJobs: [],
  reviews: {
    avgRating: 0,
    totalCount: 0,
    recent: [],
  },
};

function translateBusinessType(type) {
  return BUSINESS_TYPE_LABELS[type] || type;
}

function calculateAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

function formatDateRange(startDate, endDate) {
  const start = startDate ? String(startDate).replace(/-/g, '.') : '';
  const end = endDate ? String(endDate).replace(/-/g, '.') : '현재';
  return start || end ? `${start} ~ ${end}` : '-';
}

function formatPreferredLocations(preferredRegions) {
  if (!Array.isArray(preferredRegions)) return [];
  return preferredRegions
    .map((region) => `${region?.sido ?? ''} ${region?.sigungu ?? ''}`.trim())
    .filter(Boolean);
}

function mapResumeDetailToTalent(data) {
  const reviews = Array.isArray(data?.reviews) ? data.reviews : [];
  const mappedReviews = reviews.map((review) => ({
    reviewer:
      review?.companyName ||
      review?.writerCompanyName ||
      review?.writerName ||
      review?.reviewerName ||
      '작성자',
    rating: Number(review?.rating ?? 0),
    date: (review?.writtenAt || review?.createdAt || '').toString().slice(0, 10).replace(/-/g, '.'),
    text: review?.content || '',
  }));

  return {
    photo:
      data?.profileImageUrl ||
      data?.image ||
      'https://cdn-icons-png.flaticon.com/512/2815/2815428.png',
    name: data?.memberName ?? data?.name ?? '이름 없음',
    birthDate: data?.birthDate ?? '',
    age: calculateAge(data?.birthDate),
    address: data?.address ?? '-',
    gender: data?.gender ?? '-',
    phone: data?.phone ?? '-',
    email: data?.email ?? '-',
    education:
      Array.isArray(data?.educations) && data.educations.length > 0
        ? {
            school: data.educations[0].schoolName ?? '-',
            major: data.educations[0].major ?? '-',
            degree: data.educations[0].schoolType ?? '-',
          }
        : null,
    careers: (data?.careers ?? []).map((career) => ({
      company: career.company ?? '-',
      role: career.role ?? '-',
      period: formatDateRange(career.startDate, career.endDate),
      desc: career.description ?? '',
    })),
    certificates: (data?.licenses ?? []).map((license) => ({
      name: license.licenseName ?? '-',
      issuer: license.issuedBy ?? '-',
      date: license.acquisitionDate ? String(license.acquisitionDate).replace(/-/g, '.') : '-',
    })),
    preferredLocations: formatPreferredLocations(data?.preferredRegions),
    preferredJobs: (data?.desiredBusinessTypes ?? data?.desiredTypes ?? []).map(translateBusinessType),
    reviews: {
      avgRating: Number(data?.ratingAverage ?? data?.avgRating ?? 0),
      totalCount: reviews.length,
      recent: mappedReviews.slice(0, 3),
    },
  };
}

function SectionTitle({ children }) {
  return <h3 className="text-sm font-bold text-primary mb-3">{children}</h3>;
}

function Card({ children }) {
  return <section className="bg-white rounded-2xl border border-outline p-6">{children}</section>;
}

export default function TalentProfilePageCopied({ resumeId, applyId, applyStatus, onBack, onDecisionComplete }) {
  const [talentData, setTalentData] = useState(initialTalentData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [currentApplyStatus, setCurrentApplyStatus] = useState(String(applyStatus || '').toUpperCase());

  useEffect(() => {
    setCurrentApplyStatus(String(applyStatus || '').toUpperCase());
  }, [applyStatus]);

  useEffect(() => {
    let mounted = true;

    const loadResumeDetail = async () => {
      if (!resumeId) {
        if (mounted) {
          setError('이력서 ID가 없습니다.');
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_BASE}/human-resource/${resumeId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error || `HTTP ${response.status}`);
        }

        if (mounted) {
          setTalentData(mapResumeDetailToTalent(result));
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError?.message || '지원자 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadResumeDetail();

    return () => {
      mounted = false;
    };
  }, [resumeId]);

  if (loading) {
    return <div className="bg-white rounded-2xl border border-outline p-10 text-center text-on-surface-variant">지원자 정보를 불러오는 중입니다.</div>;
  }

  if (error) {
    return <div className="bg-white rounded-2xl border border-outline p-10 text-center text-red-500">{error}</div>;
  }

  const canDecide = Boolean(applyId) && currentApplyStatus === 'PENDING';

  const handleDecision = async (accept) => {
    if (!canDecide || decisionLoading) return;

    const confirmed = window.confirm(
      accept ? '이 지원자를 수락하시겠습니까?' : '이 지원자를 거절하시겠습니까?'
    );
    if (!confirmed) return;

    try {
      setDecisionLoading(true);
      await decideBusinessApplication(applyId, accept);

      const nextStatus = accept ? 'ACCEPTED' : 'REJECTED';
      setCurrentApplyStatus(nextStatus);
      if (typeof onDecisionComplete === 'function') {
        onDecisionComplete(applyId, nextStatus);
      }
      window.alert(accept ? '지원자를 수락했습니다.' : '지원자를 거절했습니다.');
    } catch (decisionError) {
      window.alert(decisionError?.message || '수락/거절 처리에 실패했습니다.');
    } finally {
      setDecisionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline bg-white text-sm font-bold hover:bg-gray-50"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        지원자 목록으로
      </button>

      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-surface-container-low border border-outline shrink-0">
            <img src={talentData.photo} alt={talentData.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-on-surface">{talentData.name}</h2>
              <p className="text-sm text-on-surface-variant">평점 {talentData.reviews.avgRating.toFixed(1)} / 리뷰 {talentData.reviews.totalCount}개</p>
              <p className="text-sm text-on-surface-variant">생년월일: {talentData.birthDate || '-'}{talentData.age != null ? ` (${talentData.age}세)` : ''}</p>
              <p className="text-sm text-on-surface-variant">성별: {talentData.gender || '-'}</p>
              <p className="text-sm text-on-surface-variant">주소: {talentData.address || '-'}</p>
              <p className="text-sm text-on-surface-variant">연락처: {talentData.phone || '-'}</p>
              <p className="text-sm text-on-surface-variant">이메일: {talentData.email || '-'}</p>
            </div>

            {canDecide && (
              <div className="flex items-start gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDecision(true)}
                  disabled={decisionLoading}
                  className="px-3 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-deep disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {decisionLoading ? '처리 중...' : '수락'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision(false)}
                  disabled={decisionLoading}
                  className="px-3 py-2 rounded-lg text-sm font-bold border border-outline bg-white text-on-surface hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  거절
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <SectionTitle>학력</SectionTitle>
          {talentData.education ? (
            <p className="text-sm text-on-surface">{talentData.education.school} / {talentData.education.major} / {talentData.education.degree}</p>
          ) : (
            <p className="text-sm text-on-surface-variant">학력 정보가 없습니다.</p>
          )}
        </Card>

        <Card>
          <SectionTitle>희망 근무 정보</SectionTitle>
          <p className="text-sm text-on-surface-variant">희망근무지: {talentData.preferredLocations.length ? talentData.preferredLocations.join(' · ') : '-'}</p>
          <p className="text-sm text-on-surface-variant mt-1">희망업직종: {talentData.preferredJobs.length ? talentData.preferredJobs.join(' · ') : '-'}</p>
        </Card>
      </div>

      <Card>
        <SectionTitle>경력</SectionTitle>
        {talentData.careers.length > 0 ? (
          <div className="space-y-3">
            {talentData.careers.map((career, index) => (
              <div key={`${career.company}-${index}`} className="p-3 rounded-xl border border-outline">
                <p className="font-bold text-on-surface">{career.company} ({career.role})</p>
                <p className="text-xs text-on-surface-variant">{career.period}</p>
                <p className="text-sm text-on-surface-variant mt-1">{career.desc || '-'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">경력 정보가 없습니다.</p>
        )}
      </Card>

      <Card>
        <SectionTitle>자격증</SectionTitle>
        {talentData.certificates.length > 0 ? (
          <div className="space-y-2">
            {talentData.certificates.map((cert, index) => (
              <p key={`${cert.name}-${index}`} className="text-sm text-on-surface-variant">{cert.name} / {cert.issuer} / {cert.date}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">자격증 정보가 없습니다.</p>
        )}
      </Card>

      <Card>
        <SectionTitle>최근 리뷰</SectionTitle>
        {talentData.reviews.recent.length > 0 ? (
          <div className="space-y-3">
            {talentData.reviews.recent.map((review, index) => (
              <div key={`${review.reviewer}-${index}`} className="p-3 rounded-xl border border-outline">
                <p className="text-sm font-bold text-on-surface">{review.reviewer} · {review.rating.toFixed(1)}</p>
                <p className="text-xs text-on-surface-variant">{review.date || '-'}</p>
                <p className="text-sm text-on-surface mt-1">{review.text || '-'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">리뷰 정보가 없습니다.</p>
        )}
      </Card>
    </div>
  );
}

