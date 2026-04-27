import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import { getStoredMember } from '../services/authApi';
import { getMyBusinessRecruits } from '../services/accountApi';
import { offerToIndividualByBusinessAndMemberId } from '../services/applyApi';
import { addBusinessScrapMemberByMemberId, checkBusinessScrapMemberByMemberId, removeBusinessScrapMemberByMemberId } from '../services/scrapMemberApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const DEFAULT_PROFILE_IMAGE = 'https://cdn-icons-png.flaticon.com/512/2815/2815428.png';

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
        topLabels: [],
        all: [],
        recent: [],
    },
};

function translateBusinessType(type) {
    return BUSINESS_TYPE_LABELS[type] || type;
}

function formatDateRange(startDate, endDate) {
    const start = startDate ? String(startDate).replace(/-/g, '.') : '';
    const end = endDate ? String(endDate).replace(/-/g, '.') : '현재';
    return start || end ? `${start} ~ ${end}` : '-';
}

function calculateAge(birthDate) {
    if (!birthDate) return null;

    const today = new Date();
    const birth = new Date(birthDate);

    if (Number.isNaN(birth.getTime())) return null;

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

function formatPreferredLocations(preferredRegions) {
    if (!Array.isArray(preferredRegions)) return [];

    return preferredRegions
        .map((region) => {
            const sido = region?.sido ?? '';
            const sigungu = region?.sigungu ?? '';
            return `${sido} ${sigungu}`.trim();
        })
        .filter(Boolean);
}

function formatPreferredJobs(desiredTypes) {
    if (!Array.isArray(desiredTypes)) return [];
    return desiredTypes.map(translateBusinessType);
}

function getReviewLabelNames(review) {
    if (Array.isArray(review?.labelNames)) {
        return review.labelNames
            .map((label) => String(label).trim())
            .filter(Boolean);
    }

    if (Array.isArray(review?.labels)) {
        return review.labels
            .map((label) => {
                if (typeof label === 'string') return label;
                return label?.name ?? label?.labelName ?? '';
            })
            .map((label) => String(label).trim())
            .filter(Boolean);
    }

    return [];
}

function getReviewWriterName(review) {
    return (
        review?.companyName ||
        review?.writerCompanyName ||
        review?.businessName ||
        review?.writerName ||
        review?.reviewerName ||
        review?.writerNickname ||
        (review?.writerId ? `작성자 #${review.writerId}` : '작성자')
    );
}

function formatReviewDate(review) {
    const date =
        review?.writtenAt ||
        review?.createdAt ||
        review?.updatedAt ||
        '';

    return date ? String(date).slice(0, 10).replace(/-/g, '.') : '';
}

function mapReviewLabels(reviews) {
    const labelCountMap = new Map();

    reviews.forEach((review) => {
        getReviewLabelNames(review).forEach((label) => {
            const key = String(label).trim();
            if (!key) return;
            labelCountMap.set(key, (labelCountMap.get(key) ?? 0) + 1);
        });
    });

    return Array.from(labelCountMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([label, count]) => ({
            label: `#${label}`,
            count,
        }));
}

function mapResumeDetailToTalent(data) {
    const reviews = Array.isArray(data?.reviews) ? data.reviews : [];
    const avgRating = Number(data?.ratingAverage ?? data?.avgRating ?? 0);

    const mappedReviews = reviews.map((review) => ({
        reviewer: getReviewWriterName(review),
        rating: Number(review.rating ?? 0),
        date: formatReviewDate(review),
        text: review.content ?? '',
        labels: getReviewLabelNames(review),
    }));

    return {
        photo:
            data?.profileImageUrl ||
            data?.image ||
            DEFAULT_PROFILE_IMAGE,
        name: data?.memberName ?? data?.name ?? '이름 없음',
        birthDate: data?.birthDate ?? '',
        age: calculateAge(data?.birthDate),
        address: data?.address ?? '',
        gender: data?.gender ?? '',
        phone: data?.phone ?? '',
        email: data?.email ?? '',
        education:
            Array.isArray(data?.educations) && data.educations.length > 0
                ? {
                    school: data.educations[0].schoolName ?? '-',
                    major: data.educations[0].major ?? '-',
                    degree: data.educations[0].schoolType ?? '-',
                    period: '-',
                }
                : null,
        careers: (data?.careers ?? []).map((c) => ({
            company: c.company ?? '-',
            role: c.role ?? '-',
            period: formatDateRange(c.startDate, c.endDate),
            desc: c.description ?? '',
        })),
        certificates: (data?.licenses ?? []).map((l) => ({
            name: l.licenseName ?? '-',
            issuer: l.issuedBy ?? '-',
            date: l.acquisitionDate ? String(l.acquisitionDate).replace(/-/g, '.') : '-',
        })),
        preferredLocations: formatPreferredLocations(data?.preferredRegions),
        preferredJobs: formatPreferredJobs(data?.desiredBusinessTypes ?? data?.desiredTypes ?? []),
        memberId: data?.memberId ?? null,
        reviews: {
            avgRating,
            totalCount: reviews.length,
            topLabels: mapReviewLabels(reviews),
            all: mappedReviews,
            recent: mappedReviews.slice(0, 3),
        },
    };
}

function resolveIndividualProfileId(data) {
    return data?.individualProfileId || data?.individualProfile?.id || null;
}

function StarRating({ rating, size = 'text-base' }) {
    const safeRating = Number(rating ?? 0);
    const full = Math.floor(safeRating);
    const half = safeRating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
        <span className={`flex items-center gap-0.5 text-primary ${size}`}>
            {Array(full).fill(0).map((_, i) => (
                <span
                    key={`f${i}`}
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                >
                    star
                </span>
            ))}
            {half && (
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                    star_half
                </span>
            )}
            {Array(empty).fill(0).map((_, i) => (
                <span key={`e${i}`} className="material-symbols-outlined">
                    star
                </span>
            ))}
        </span>
    );
}

function SectionTitle({ icon, children }) {
    return (
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-5">
            <span className="material-symbols-outlined text-sm">{icon}</span>
            {children}
        </h2>
    );
}

function ReviewCard({ review }) {
    return (
        <div className="p-5 bg-surface-container-low rounded-xl border border-outline">
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center">
                        <span
                            className="material-symbols-outlined text-primary text-sm"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                            storefront
                        </span>
                    </div>
                    <span className="font-bold text-sm text-on-surface">{review.reviewer}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <StarRating rating={review.rating} size="text-sm" />
                    <span className="text-xs font-bold text-primary ml-1">{review.rating}</span>
                </div>
            </div>

            <p className="text-sm text-on-surface leading-relaxed">{review.text}</p>

            {review.labels?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {review.labels.map((label, idx) => (
                        <span
                            key={`${label}-${idx}`}
                            className="bg-primary-soft text-primary text-[11px] font-bold px-2.5 py-1 rounded-full"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}

            <p className="text-xs text-on-surface-variant mt-2 text-right">{review.date}</p>
        </div>
    );
}

export default function TalentProfilePage() {
    const navigate = useNavigate();
    const { resumeId } = useParams();
    const storedMember = getStoredMember();
    const isBusinessMember = storedMember?.memberType === 'BUSINESS';

    const [showContactModal, setShowContactModal] = useState(false);
    const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [talentData, setTalentData] = useState(initialTalentData);
    const [targetIndividualProfileId, setTargetIndividualProfileId] = useState(null);

    const [offerMessage, setOfferMessage] = useState('');
    const [selectedRecruitId, setSelectedRecruitId] = useState('');
    const [recruitOptions, setRecruitOptions] = useState([]);
    const [loadingRecruits, setLoadingRecruits] = useState(false);
    const [offerSubmitting, setOfferSubmitting] = useState(false);

    const [scrapLoading, setScrapLoading] = useState(false);
    const [isScrapped, setIsScrapped] = useState(false);

    const [actionError, setActionError] = useState('');
    const [actionMessage, setActionMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!actionMessage) return undefined;

        const timer = window.setTimeout(() => {
            setActionMessage('');
        }, 2000);

        return () => window.clearTimeout(timer);
    }, [actionMessage]);

    useEffect(() => {
        async function loadResumeDetail() {
            if (!resumeId) {
                setError('이력서 ID가 없습니다.');
                setLoading(false);
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

                setTalentData(mapResumeDetailToTalent(result));
                setTargetIndividualProfileId(resolveIndividualProfileId(result));

                // memberId 기반으로 스크랩 여부 초기화
                if (isBusinessMember && result?.memberId) {
                    try {
                        const scrapped = await checkBusinessScrapMemberByMemberId(result.memberId);
                        setIsScrapped(Boolean(scrapped));
                    } catch {
                        setIsScrapped(false);
                    }
                }
            } catch (e) {
                console.error(e);
                setError(e.message || '인재 프로필 정보를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        }

        loadResumeDetail();
    }, [resumeId]);

    useEffect(() => {
        let mounted = true;

        const loadBusinessRecruits = async () => {
            if (!isBusinessMember) {
                setRecruitOptions([]);
                setSelectedRecruitId('');
                return;
            }

            try {
                setLoadingRecruits(true);
                const data = await getMyBusinessRecruits();
                if (!mounted) return;

                const items = Array.isArray(data) ? data : [];
                setRecruitOptions(items);
                if (items.length > 0) {
                    setSelectedRecruitId(String(items[0]?.id || ''));
                }
            } catch {
                if (!mounted) return;
                setRecruitOptions([]);
            } finally {
                if (mounted) setLoadingRecruits(false);
            }
        };

        loadBusinessRecruits();

        return () => {
            mounted = false;
        };
    }, [isBusinessMember]);

    // 핸들러 함수들
    const handleScrap = async () => {
        if (!isBusinessMember) {
            setShowContactModal(true);
            return;
        }
        const memberIdForScrap = talentData?.memberId;
        if (!memberIdForScrap) {
            setActionError('이 인재의 회원 ID를 가져오지 못했습니다.');
            return;
        }
        if (scrapLoading) return;

        // 이미 스크랩된 경우 스크랩 해제
        if (isScrapped) {
            try {
                setScrapLoading(true);
                setActionError('');
                setActionMessage('');
                await removeBusinessScrapMemberByMemberId(memberIdForScrap);
                setIsScrapped(false);
                setActionMessage('스크랩이 해제되었습니다.');
            } catch (e) {
                setActionError(e?.message || '스크랩 해제에 실패했습니다.');
            } finally {
                setScrapLoading(false);
            }
            return;
        }

        // 스크랩 추가
        try {
            setScrapLoading(true);
            setActionError('');
            setActionMessage('');
            await addBusinessScrapMemberByMemberId(memberIdForScrap);
            setIsScrapped(true);
            setActionMessage('스크랩되었습니다!');
        } catch (e) {
            setActionError(e?.message || '스크랩에 실패했습니다.');
        } finally {
            setScrapLoading(false);
        }
    };

    const handleOpenOffer = () => {
        if (!isBusinessMember) {
            setShowContactModal(true);
            return;
        }
        setActionError('');
        setActionMessage('');
        setShowOfferModal(true);
    };

    const handleSubmitOffer = async () => {
        if (!isBusinessMember) return;
        if (!selectedRecruitId) {
            setActionError('제의할 공고를 선택해주세요.');
            return;
        }
        const memberIdForOffer = talentData?.memberId;
        if (!memberIdForOffer) {
            setActionError('이 인재의 회원 ID를 가져오지 못했습니다.');
            return;
        }
        if (offerSubmitting) return;

        try {
            setOfferSubmitting(true);
            setActionError('');
            
            const messageText = offerMessage.trim();
            
            await offerToIndividualByBusinessAndMemberId({
                recruitId: Number(selectedRecruitId),
                memberId: Number(memberIdForOffer),
                message: messageText,
            });

            const selectedRecruitName = recruitOptions.find(r => String(r.id) === String(selectedRecruitId))?.title || '공고';
            const userEmail = storedMember?.email || '회원';
            const recruitLink = `${window.location.origin}/recruit-detail?recruitId=${selectedRecruitId}`;
            
            const message1 = `${userEmail}님께서 [${selectedRecruitName}] 공고를 제의합니다.\n공고 보기: ${recruitLink}`;
            
            const messagesToDispatch = messageText ? [message1, messageText] : [message1];

            window.dispatchEvent(
                new CustomEvent('send-direct-messages', {
                    detail: {
                        partnerUserId: Number(memberIdForOffer),
                        messages: messagesToDispatch,
                    },
                })
            );

            setShowOfferModal(false);
            setOfferMessage('');
            setActionMessage('제의가 성공적으로 전송되었습니다!');
        } catch (e) {
            setActionError(e?.message || '제의 전송에 실패했습니다.');
        } finally {
            setOfferSubmitting(false);
        }
    };

    const d = talentData;

    if (loading) {
        return (
            <>
                <TopNavBar />
                <main className="max-w-4xl mx-auto px-6 py-12 pt-32 pb-56">
                    <div className="text-center py-20 text-on-surface-variant font-medium">
                        프로필을 불러오는 중...
                    </div>
                </main>
                <AppFooter />
            </>
        );
    }

    if (error) {
        return (
            <>
                <TopNavBar />
                <main className="max-w-4xl mx-auto px-6 py-12 pt-32 pb-40">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-primary font-bold text-sm mb-8 hover:opacity-80 transition-opacity"
                    >
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        인재 목록으로
                    </button>

                    <div className="bg-white rounded-2xl border border-outline p-10 text-center text-red-600 font-medium">
                        {error}
                    </div>
                </main>
                <AppFooter />
            </>
        );
    }

    return (
        <>
            <TopNavBar />

            <main className="max-w-4xl mx-auto px-6 py-12 pt-32 pb-40">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-primary font-bold text-sm mb-8 hover:opacity-80 transition-opacity"
                >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    인재 목록으로
                </button>

                <section className="bg-white rounded-2xl border border-outline p-8 mb-8 flex flex-col md:flex-row md:items-start gap-8">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-surface-container-low border border-outline shrink-0">
                        <img src={d.photo} alt={d.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{d.name}</h1>
                            <div className="flex items-center gap-2 mt-1 text-primary text-sm font-bold">
                                <StarRating rating={d.reviews.avgRating} size="text-sm" />
                                <span>{d.reviews.avgRating.toFixed(1)}</span>
                                <span className="text-on-surface-variant font-medium">
                                    ({d.reviews.totalCount}개 리뷰)
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <InfoRow icon="cake" label="생년월일">
                                {d.birthDate ? `${d.birthDate}${d.age ? ` (${d.age}세)` : ''}` : '-'}
                            </InfoRow>
                            <InfoRow icon="wc" label="성별">{d.gender || '-'}</InfoRow>
                            <InfoRow icon="location_on" label="주소">{d.address || '-'}</InfoRow>
                            <InfoRow icon="call" label="전화번호">{d.phone || '-'}</InfoRow>
                            <InfoRow icon="mail" label="이메일" className="sm:col-span-2">
                                {d.email || '-'}
                            </InfoRow>
                        </div>
                    </div>
                </section>

                <div className="space-y-6">
                    <Card>
                        <SectionTitle icon="school">학력 (최종)</SectionTitle>
                        {d.education ? (
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-base">school</span>
                                </div>
                                <div>
                                    <p className="font-bold text-on-surface">{d.education.school}</p>
                                    <p className="text-sm text-on-surface-variant font-medium">
                                        {d.education.major} · {d.education.degree}
                                    </p>
                                    <p className="text-xs text-on-surface-variant mt-0.5">{d.education.period}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-on-surface-variant">학력 정보가 없습니다.</p>
                        )}
                    </Card>

                    <Card>
                        <SectionTitle icon="work">경력</SectionTitle>
                        <div className="space-y-5">
                            {d.careers.length > 0 ? (
                                d.careers.map((c, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary text-base">
                                                business_center
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-bold text-on-surface">{c.company}</span>
                                                <span className="bg-primary-soft text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                    {c.role}
                                                </span>
                                            </div>
                                            <p className="text-xs text-on-surface-variant mt-0.5 mb-1">{c.period}</p>
                                            <p className="text-sm text-on-surface-variant">{c.desc || '설명 없음'}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-on-surface-variant">경력 정보가 없습니다.</p>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <SectionTitle icon="verified">자격증</SectionTitle>
                        {d.certificates.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {d.certificates.map((cert, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl border border-outline"
                                    >
                                        <span
                                            className="material-symbols-outlined text-primary text-xl mt-0.5"
                                            style={{ fontVariationSettings: '"FILL" 1' }}
                                        >
                                            badge
                                        </span>
                                        <div>
                                            <p className="font-bold text-on-surface text-sm">{cert.name}</p>
                                            <p className="text-xs text-on-surface-variant">{cert.issuer}</p>
                                            <p className="text-xs text-on-surface-variant">{cert.date} 취득</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-on-surface-variant">자격증 정보가 없습니다.</p>
                        )}
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <SectionTitle icon="location_on">희망근무지</SectionTitle>
                            <div className="space-y-2">
                                {d.preferredLocations.length > 0 ? (
                                    d.preferredLocations.map((loc, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-on-surface">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                                            {loc}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-on-surface-variant">희망근무지 정보가 없습니다.</p>
                                )}
                            </div>
                        </Card>

                        <Card>
                            <SectionTitle icon="category">희망업직종</SectionTitle>
                            <div className="flex flex-wrap gap-2">
                                {d.preferredJobs.length > 0 ? (
                                    d.preferredJobs.map((job, i) => (
                                        <span
                                            key={i}
                                            className="bg-primary-soft text-primary font-bold text-xs px-3 py-1.5 rounded-full border border-primary/20"
                                        >
                                            {job}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-on-surface-variant">희망업직종 정보가 없습니다.</p>
                                )}
                            </div>
                        </Card>
                    </div>

                    <Card>
                        <SectionTitle icon="reviews">리뷰</SectionTitle>

                        <div className="flex justify-end -mt-2 mb-4">
                            <button
                                onClick={() => setShowAllReviewsModal(true)}
                                className="text-xs font-bold text-primary hover:underline underline-offset-2 transition-all"
                            >
                                리뷰 전체 보기
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-5xl font-black text-on-surface">
                                    {d.reviews.avgRating.toFixed(1)}
                                </span>
                                <div>
                                    <StarRating rating={d.reviews.avgRating} size="text-xl" />
                                    <p className="text-xs text-on-surface-variant mt-1">
                                        총 {d.reviews.totalCount}개의 평가
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {d.reviews.topLabels.length > 0 ? (
                                    d.reviews.topLabels.map((lbl, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 bg-surface-container-low border border-outline rounded-full px-4 py-2"
                                        >
                                            <span className="text-xs font-bold text-on-surface">{lbl.label}</span>
                                            <span className="text-[10px] font-black text-primary bg-primary-soft rounded-full px-1.5 py-0.5">
                                                {lbl.count}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-on-surface-variant">리뷰 라벨 정보가 없습니다.</p>
                                )}
                            </div>
                        </div>

                        <div className="h-px bg-outline/30 mb-6"></div>

                        <div className="space-y-4">
                            {d.reviews.recent.length > 0 ? (
                                d.reviews.recent.map((rv, i) => (
                                    <ReviewCard key={`recent-${i}`} review={rv} />
                                ))
                            ) : (
                                <p className="text-sm text-on-surface-variant">리뷰가 없습니다.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </main>

            {(actionMessage || actionError) && (
                <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-lg text-sm font-bold transition-all ${
                    actionError ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                }`}>
                    {actionError || actionMessage}
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-outline px-6 py-4 z-50">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={handleScrap}
                        disabled={scrapLoading}
                        className={`flex flex-col items-center gap-1 transition-colors shrink-0 disabled:opacity-60 ${
                            isScrapped ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                        }`}
                        title={isScrapped ? '스크랩됨' : '스크랩하기'}
                    >
                        <span
                            className="material-symbols-outlined text-2xl"
                            style={isScrapped ? { fontVariationSettings: '"FILL" 1' } : {}}
                        >
                            {scrapLoading ? 'hourglass_top' : 'bookmark'}
                        </span>
                        <span className="text-[10px] font-bold">{isScrapped ? '스크랩됨' : '스크랩'}</span>
                    </button>
                    <div className="h-10 w-px bg-outline/30 mx-2 hidden md:block"></div>
                    <div className="flex-1 flex gap-3">
                        <CommonButton
                            className="flex-1 rounded-xl"
                            onClick={handleOpenOffer}
                        >
                            제의하기
                        </CommonButton>
                    </div>
                </div>
            </div>

            <div
                className={`${showAllReviewsModal ? '' : 'hidden'} fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6`}
            >
                <div
                    className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
                    onClick={() => setShowAllReviewsModal(false)}
                ></div>

                <div className="relative bg-white w-full max-w-3xl rounded-2xl border border-outline shadow-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-outline flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-extrabold text-on-surface">전체 리뷰</h3>
                            <p className="text-xs text-on-surface-variant mt-1">
                                총 {d.reviews.totalCount}개 중 표시 가능한 리뷰
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAllReviewsModal(false)}
                            className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-variant transition-colors"
                            aria-label="전체 리뷰 모달 닫기"
                        >
                            <span className="material-symbols-outlined text-on-surface-variant">close</span>
                        </button>
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto p-6 space-y-4 bg-surface-container-low/40">
                        {d.reviews.all.length > 0 ? (
                            d.reviews.all.map((rv, i) => (
                                <ReviewCard key={`all-${i}`} review={rv} />
                            ))
                        ) : (
                            <p className="text-sm text-on-surface-variant">리뷰가 없습니다.</p>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t border-outline bg-white flex justify-end">
                        <CommonButton variant="subtle" onClick={() => setShowAllReviewsModal(false)}>
                            닫기
                        </CommonButton>
                    </div>
                </div>
            </div>

            <AppFooter />

            {/* 비사업자 안내 모달 */}
            <div className={`${showContactModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
                <div
                    className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
                    onClick={() => setShowContactModal(false)}
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
                    <h5 className="text-2xl font-bold mb-3">기업회원 전용 메뉴입니다</h5>
                    <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
                        인재 제의 및 스크랩은
                        <br />
                        기업회원 로그인 후 이용하실 수 있습니다.
                    </p>
                    <div className="w-full flex flex-col gap-3">
                        <CommonButton size="full" onClick={() => setShowContactModal(false)}>
                            기업회원 로그인
                        </CommonButton>
                        <CommonButton variant="subtle" size="full" onClick={() => setShowContactModal(false)}>
                            기업회원 가입하기
                        </CommonButton>
                    </div>
                    <button
                        className="mt-6 text-on-surface-variant text-sm font-bold underline decoration-outline underline-offset-4"
                        onClick={() => setShowContactModal(false)}
                    >
                        닫기
                    </button>
                </div>
            </div>

            {/* 제의하기 모달 */}
            <div className={`${showOfferModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
                <div
                    className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
                    onClick={() => setShowOfferModal(false)}
                ></div>
                <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-outline flex items-center justify-between">
                        <h3 className="text-xl font-extrabold text-on-surface">제의하기</h3>
                        <button
                            onClick={() => setShowOfferModal(false)}
                            className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-variant transition-colors flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined text-on-surface-variant">close</span>
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                                제의할 공고 선택 <span className="text-red-500">*</span>
                            </label>
                            {loadingRecruits ? (
                                <p className="text-sm text-on-surface-variant">공고를 불러오는 중...</p>
                            ) : recruitOptions.length === 0 ? (
                                <p className="text-sm text-red-500">등록된 공고가 없습니다. 먼저 공고를 등록해주세요.</p>
                            ) : (
                                <select
                                    value={selectedRecruitId}
                                    onChange={(e) => setSelectedRecruitId(e.target.value)}
                                    className="w-full rounded-xl border border-outline px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">공고 선택</option>
                                    {recruitOptions.map((r) => (
                                        <option key={r.id} value={String(r.id)}>
                                            {r.title || `공고 #${r.id}`}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                                메시지 (선택)
                            </label>
                            <textarea
                                value={offerMessage}
                                onChange={(e) => setOfferMessage(e.target.value)}
                                placeholder="제의 메시지를 입력하세요..."
                                rows={4}
                                className="w-full rounded-xl border border-outline px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        {actionError && (
                            <p className="text-xs text-red-600 font-medium">{actionError}</p>
                        )}
                    </div>
                    <div className="px-6 py-4 border-t border-outline bg-white flex justify-end gap-3">
                        <CommonButton variant="subtle" onClick={() => setShowOfferModal(false)}>
                            취소
                        </CommonButton>
                        <CommonButton
                            onClick={handleSubmitOffer}
                            disabled={offerSubmitting || !selectedRecruitId}
                        >
                            {offerSubmitting ? '전송 중...' : '제의 전송'}
                        </CommonButton>
                    </div>
                </div>
            </div>
        </>
    );
}

function Card({ children }) {
    return <div className="bg-white rounded-2xl border border-outline p-7">{children}</div>;
}

function InfoRow({ icon, label, children, className = '' }) {
    return (
        <div className={`flex items-start gap-2 ${className}`}>
            <span className="material-symbols-outlined text-base text-on-surface-variant mt-0.5">{icon}</span>
            <div>
                <span className="text-xs text-on-surface-variant block">{label}</span>
                <span className="font-semibold text-on-surface text-sm">{children}</span>
            </div>
        </div>
    );
}