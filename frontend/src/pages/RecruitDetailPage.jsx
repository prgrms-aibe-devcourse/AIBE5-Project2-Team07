import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import KakaoMap from '../components/KakaoMap';
import { getStoredMember } from '../services/authApi';

const API_PREFIXES = ['/api', ''];

const PERIOD_LABELS = {
  OneDay: '하루',
  OneWeek: '1주 이하',
  OneMonth: '1개월 이하',
  ThreeMonths: '3개월 이하',
  SixMonths: '6개월 이하',
  OneYear: '1년 이하',
  MoreThanOneYear: '1년 이상'
};

const DAY_LABELS = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일'
};

const TIME_LABELS = {
  MORNING: '오전',
  AFTERNOON: '오후',
  EVENING: '저녁',
  NIGHT: '새벽',
  MORNING_AFTERNOON: '오전~오후',
  AFTERNOON_EVENING: '오후~저녁',
  EVENING_NIGHT: '저녁~새벽',
  NIGHT_MORNING: '새벽~오전',
  FULLTIME: '풀타임'
};

const BUSINESS_LABELS = {
  FOOD_RESTAURANT: '외식',
  CAFE: '카페',
  RETAIL_STORE: '매장관리/판매',
  SERVICE: '서비스',
  DELIVERY_DRIVER: '운전/배달',
  MANUAL_LABOR: '현장단순노무'
};

async function fetchJsonWithFallback(path) {
  let lastError = null;

  for (const prefix of API_PREFIXES) {
    try {
      const response = await fetch(`${prefix}${path}`);
      if (response.ok) {
        return response.json();
      }
      if (response.status === 404) {
        continue;
      }
      const errorText = await response.text();
      throw new Error(errorText || `요청 실패 (${response.status})`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('상세 조회에 실패했습니다.');
}

function formatEnumList(values, labelMap) {
  if (!Array.isArray(values) || values.length === 0) {
    return '-';
  }
  return values.map((value) => labelMap[value] || value).join(', ');
}

function formatSalaryAmount(salary) {
  if (salary == null) {
	return '-';
  }
  return `${Number(salary).toLocaleString('ko-KR')}원`;
}

function getSalaryTypeMeta(salaryType) {
  if (salaryType === 'MONTHLY') {
	return {
	  label: '월급',
	  className: 'bg-rose-500 text-rose-100 border border-rose-100'
	};
  }
  return {
	label: '시급',
	className: 'bg-rose-100 text-rose-500 border border-rose-200'
  };
}

function formatAddressSpaced(address) {
  if (!address || address === '-') {
	return '-';
  }
  return address
	.replace(/([가-힣])(시|도|군|구)(?=[가-힣])/g, '$1$2 ')
	.replace(/\s+/g, ' ')
	.trim();
}

function getDday(deadline) {
  if (!deadline) {
    return '-';
  }

  const target = new Date(deadline);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) {
    return '마감';
  }
  return `D-${diff}`;
}

function normalizeRecruitStatus(status) {
  return String(status || '').toUpperCase();
}

function resolveImageUrl(rawUrl) {
  if (!rawUrl) {
    return 'https://placehold.co/120x120?text=LOGO';
  }
  if (/^(https?:)?\/\//.test(rawUrl) || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
    return rawUrl;
  }
  // /uploads/... 같은 서버 상대경로는 그대로 반환
  // → 개발 시 Vite proxy(/uploads)가 처리, 프로덕션 시 동일 origin에서 서빙
  if (rawUrl.startsWith('/')) {
    return rawUrl;
  }
  return `/${rawUrl}`;
}

export default function RecruitDetailPage() {
  const [searchParams] = useSearchParams();
  const recruitId = searchParams.get('recruitId');

  const [currentMember, setCurrentMember] = useState(() => {
    const token = localStorage.getItem('token');
    const member = getStoredMember();
    return token && member ? member : null;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = Boolean(currentMember?.id);

  useEffect(() => {
    const syncMember = () => {
      const token = localStorage.getItem('token');
      const member = getStoredMember();
      setCurrentMember(token && member ? member : null);
    };

    window.addEventListener('storage', syncMember);
    return () => window.removeEventListener('storage', syncMember);
  }, []);

  useEffect(() => {
    const fetchRecruitDetail = async () => {
      if (!recruitId) {
        setError('공고 ID가 없습니다. 목록에서 다시 진입해 주세요.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const result = await fetchJsonWithFallback(`/recruits/${recruitId}`);
        setDetail(result);
      } catch (fetchError) {
        setError(fetchError.message || '공고 상세 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitDetail();
  }, [recruitId]);

  const fullAddress = useMemo(() => {
    if (!detail) {
      return '-';
    }
    if (detail.fullAddress) {
      return detail.fullAddress;
    }
    if (detail.detailAddress) {
      return detail.detailAddress;
    }
    if (detail.regionName) {
      return detail.regionName;
    }
    if (detail.regionId != null) {
      return `지역 ID ${detail.regionId}`;
    }
    return '-';
  }, [detail]);

  const descriptionLines = useMemo(() => {
    if (!detail?.description) {
      return [];
    }
    return detail.description
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [detail]);

  const salaryTypeMeta = useMemo(() => getSalaryTypeMeta(detail?.salaryType), [detail?.salaryType]);
  const displayAddress = useMemo(() => formatAddressSpaced(fullAddress), [fullAddress]);
  const isOpenStatus = useMemo(() => normalizeRecruitStatus(detail?.status) === 'OPEN', [detail?.status]);
  const deadlineBadgeText = useMemo(() => (isOpenStatus ? getDday(detail?.deadline) : '마감'), [isOpenStatus, detail?.deadline]);

  const handleApplyClick = () => {
    if (!isOpenStatus) {
      return;
    }
    if (isLoggedIn) {
      navigate('/apply-form');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleChatClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const targetMemberId = detail?.businessMemberId;
    if (!targetMemberId) {
      window.alert('채팅을 시작할 회원 정보를 찾지 못했습니다.');
      return;
    }

    if (currentMember?.id === targetMemberId) {
      window.alert('본인 공고에는 채팅을 시작할 수 없습니다.');
      return;
    }

    window.dispatchEvent(
      new CustomEvent('open-direct-chat', {
        detail: {
          targetUserId: targetMemberId,
          recruitId: detail?.id ?? null,
          recruitTitle: detail?.title ?? '',
          companyName: detail?.companyName ?? '',
        },
      }),
    );
  };

  return (
    <>
      <TopNavBar />
      <main className="max-w-4xl mx-auto px-6 py-12 pt-32 pb-40">
        {loading && <p className="py-10 text-on-surface-variant">공고를 불러오는 중입니다...</p>}
        {!loading && error && <p className="py-10 text-red-600">{error}</p>}

        {!loading && !error && detail && (
          <>
            <section className="mb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="editorial-line">
                  <div className="flex items-center gap-3 mb-2">
                    {detail.brandId != null && (
					  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-900 text-white">
						BRAND
					  </span>
					)}
                    <span className="bg-primary-soft text-primary px-2 py-0.5 text-xs font-bold rounded">
                      {formatEnumList(detail.businessType, BUSINESS_LABELS)}
                    </span>
                    <span className="text-on-surface-variant text-sm font-medium">{detail.companyName || '-'}</span>
                  </div>
                  <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tighter">
                    {detail.title}
                  </h1>
                </div>
                {detail.brandId != null && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center shrink-0 border border-outline">
                    <img className="w-full h-full object-cover" alt="brand logo" src={resolveImageUrl(detail.logoImg)} />
                  </div>
                )}
              </div>
            </section>

            <div className="space-y-16">
              <section>
                <div className="flex items-center mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-primary">모집요강 요약</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">급여</span>
                    <div className="inline-flex items-center gap-2 max-w-full">
					  <span className="text-xl font-bold text-on-surface truncate">{formatSalaryAmount(detail.salary)}</span>
					  <span className={`inline-flex shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold ${salaryTypeMeta.className}`}>
						{salaryTypeMeta.label}
					  </span>
					</div>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">근무기간</span>
                    <span className="text-xl font-bold">{formatEnumList(detail.workPeriod, PERIOD_LABELS)}</span>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">근무요일</span>
                    <div className="flex flex-wrap gap-1.5">
					  {(Array.isArray(detail.workDays) && detail.workDays.length > 0) ? detail.workDays.map((day) => (
            <span key={day} className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-primary-soft text-primary border border-primary/20">
						  {DAY_LABELS[day] || day}
						</span>
					  )) : <span className="text-xl font-bold">-</span>}
					</div>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">근무시간</span>
                    <span className="text-xl font-bold">{formatEnumList(detail.workTime, TIME_LABELS)}</span>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">모집 인원</span>
                    <span className="text-xl font-bold">{detail.headCount ? `${detail.headCount}명` : '-'}</span>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline">
                    <span className="block text-xs text-on-surface-variant mb-1">마감일</span>
                    <div className="flex items-center gap-2">
					  <span className="text-xl font-bold">{detail.deadline || '-'}</span>
					  <span className={`px-3 py-1 rounded-full text-xs font-black ${isOpenStatus ? 'bg-primary text-white' : 'bg-gray-400 text-white'}`}>{deadlineBadgeText}</span>
					</div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-outline">
                <h3 className="font-headline text-2xl font-bold mb-6">상세 모집요강</h3>
                {descriptionLines.length > 0 ? (
                  <ul className="space-y-2 text-on-surface">
                    {descriptionLines.map((line, index) => (
                      <li key={`${line}-${index}`} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-on-surface-variant">상세 설명이 등록되지 않았습니다.</p>
                )}
              </section>

              <section>
                <h3 className="font-headline text-2xl font-bold mb-6">근무지 위치</h3>
                <div className="bg-surface-container rounded-2xl overflow-hidden relative mb-4 h-[400px] border border-outline">
                  <KakaoMap
                    lat={detail.latitude || 37.5665}
                    lng={detail.longitude || 126.978}
                    level={3}
                    address={fullAddress}
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border border-outline shadow-none">
                    <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                    {displayAddress}
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2 text-sm text-on-surface">
				  <span className="material-symbols-outlined text-primary text-base">location_on</span>
				  <span className="font-medium">근무지 주소: {displayAddress}</span>
				</div>
{/*                 <div className="text-sm text-on-surface-variant"> */}
{/*                   {detail.latitude && detail.longitude ? '정확한 좌표로 표시 중입니다.' : '위/경도 데이터가 없어 기본 좌표로 표시 중입니다.'} */}
{/*                 </div> */}
              </section>

              <section className="bg-surface-container-low p-8 rounded-2xl border border-outline">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline text-xl font-bold">근무 후기</h3>
                  <a className="text-primary text-xs font-bold hover:underline" href="#">View More</a>
                </div>
                <p className="text-sm text-on-surface-variant">리뷰 API 연동 전까지는 상세 보기만 연결했습니다.</p>
              </section>

              <section className="p-8 rounded-2xl bg-white border border-outline">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6">
                    {detail.brandId != null && (
                      <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-3 border border-outline">
                        <img className="w-full h-full object-contain" alt="brand logo" src={resolveImageUrl(detail.logoImg)} />
                      </div>
                    )}
                    <div>
                      <h5 className="font-bold text-lg text-on-surface">{detail.companyName || '-'}</h5>
                      <p className="text-sm text-on-surface-variant">대표/사업자번호 정보는 기업 상세 API 연동 예정</p>
                    </div>
                  </div>
                  <Link
                    to="/company-detail"
                    className="flex items-center gap-1 text-primary font-bold text-sm hover:underline underline-offset-2 transition-all"
                  >
                    기업 정보 더보기
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-on-surface-variant">
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">location_on</span> 주소: {displayAddress}</p>
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">language</span> 홈페이지: {detail.homepageUrl || '-'}</p>
                  <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">call</span> 연락처: {detail.companyPhone || '-'}</p>
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-outline px-6 py-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="flex items-center gap-6 shrink-0">
            <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">bookmark</span>
              <span className="text-[10px] font-bold">스크랩</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">share</span>
              <span className="text-[10px] font-bold">공유</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">chat</span>
              <span className="text-[10px] font-bold">채팅</span>
            </button>
          </div>
          <div className="h-10 w-px bg-outline/30 mx-2 hidden md:block"></div>
          <div className="flex-1 flex gap-3">
            <CommonButton
              variant="subtle"
              size="full"
              onClick={handleChatClick}
              className={`flex-1 rounded-xl ${currentMember?.id === detail?.businessMemberId ? 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200' : 'bg-surface-container hover:bg-surface-variant'}`}
              disabled={currentMember?.id === detail?.businessMemberId}
            >
              채팅하기
            </CommonButton>
            <CommonButton
              variant="subtle"
              size="full"
              disabled={!isOpenStatus}
              className={`flex-1 rounded-xl ${isOpenStatus ? 'bg-surface-container hover:bg-surface-variant' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              이메일 지원
            </CommonButton>
            <CommonButton
              onClick={isOpenStatus ? handleApplyClick : undefined}
              disabled={!isOpenStatus}
              className={`flex-[2] w-auto px-6 py-4 rounded-xl ${isOpenStatus ? '' : 'bg-gray-300 hover:bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              {isOpenStatus ? '온라인 지원하기' : '마감된 공고입니다'}
            </CommonButton>
          </div>
        </div>
      </div>

      <AppFooter />
      <MobileBottomNav />

      <div className={`${showLoginModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
        <div
          className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        ></div>
        <div className="relative bg-white w-full max-w-md p-10 rounded-2xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mb-6">
            <span
              className="material-symbols-outlined text-primary text-4xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              lock
            </span>
          </div>
          <h5 className="text-2xl font-bold mb-3">개인 회원 전용 메뉴입니다</h5>
          <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
            온라인 지원은 개인 회원 로그인 후 이용하실 수 있습니다.<br />
            로그인 후 간편하게 지원해 보세요!
          </p>
          <div className="w-full flex flex-col gap-3">
            <CommonButton size="full" onClick={() => setShowLoginModal(false)}>
              개인 회원 로그인
            </CommonButton>
            <CommonButton variant="subtle" size="full" onClick={() => setShowLoginModal(false)}>
              개인 회원 가입하기
            </CommonButton>
          </div>
          <button
            className="mt-6 text-on-surface-variant text-sm font-bold underline decoration-outline underline-offset-4"
            onClick={() => setShowLoginModal(false)}
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}
