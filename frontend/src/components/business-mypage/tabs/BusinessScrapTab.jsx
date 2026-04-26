import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUSINESS_TYPE_LABELS } from '../../../constants/businessTypeLabels';
import {
    getBusinessScrapMemberCount,
    getBusinessScrapMembers,
    removeBusinessScrapMemberByMemberId,
} from '../../../services/scrapMemberApi';

function formatPreferredRegions(regions) {
    if (!Array.isArray(regions) || regions.length === 0) return '-';
    return regions
        .map((region) => `${region?.sido || ''} ${region?.sigungu || ''}`.trim())
        .filter(Boolean)
        .join(' · ') || '-';
}

function translateBusinessType(type) {
    return BUSINESS_TYPE_LABELS[type] || type;
}

export default function BusinessScrapTab() {
    const navigate = useNavigate();
    const [scraps, setScraps] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);

    useEffect(() => {
        let mounted = true;

        const loadScraps = async () => {
            try {
                setLoading(true);
                setError('');

                const [pageResult, countResult] = await Promise.all([
                    getBusinessScrapMembers({ page }),
                    getBusinessScrapMemberCount(),
                ]);

                if (!mounted) return;

                setScraps(Array.isArray(pageResult?.content) ? pageResult.content : []);
                setTotalPages(Math.max(Number(pageResult?.totalPages) || 1, 1));
                setTotalCount(Number(countResult) || 0);
            } catch (fetchError) {
                if (!mounted) return;
                setScraps([]);
                setError(fetchError?.message || '스크랩 회원 목록을 불러오지 못했습니다.');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadScraps();
        return () => {
            mounted = false;
        };
    }, [page]);

    const removeScrap = async (memberId) => {
        if (!memberId) {
            window.alert('회원 ID를 찾을 수 없습니다.');
            return;
        }


        try {
            setActionLoadingId(String(memberId));
            await removeBusinessScrapMemberByMemberId(memberId);
            setScraps((prev) => prev.filter((item) => String(item?.memberId) !== String(memberId)));
            setTotalCount((prev) => Math.max(prev - 1, 0));
        } catch (actionError) {
            window.alert(actionError?.message || '스크랩 해제에 실패했습니다.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleOpenProfile = (member) => {
        // 이력서가 공개 상태인지 확인 (isActive가 true면 공개, false면 비공개)
        if (member?.isActive === false) {
            window.alert('이 회원은 이력서 노출을 허용하지 않습니다.\n프로필 정보를 확인할 수 없습니다.');
            return;
        }
        // 공개 상태이면 인재 상세 페이지로 이동
        navigate(`/talent-profile/${member?.resumeId}`);
    };

    return (
        <>
            <header className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1F1D1D]">스크랩 회원</h1>
                        <p className="text-[#6B6766] mt-1 text-sm">
                            관심 있는 구직자를 저장하고 필요할 때 바로 연락하세요.
                        </p>
                    </div>
                    <span className="bg-primary-soft text-primary text-sm font-bold px-4 py-2 rounded-xl border border-primary/10">
            총 {totalCount}명
          </span>
                </div>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm font-medium text-red-600 mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="bg-white border border-outline rounded-2xl p-16 text-center text-on-surface-variant">
                    스크랩 회원을 불러오는 중입니다.
                </div>
            ) : scraps.length === 0 ? (
                <div className="bg-white border border-outline rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-primary-soft rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">bookmark</span>
                    </div>
                    <p className="font-bold mb-1">스크랩한 회원이 없습니다</p>
                    <p className="text-sm text-on-surface-variant">
                        지원자 현황에서 마음에 드는 구직자를 스크랩해 보세요.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {scraps.map((member) => {
                        return (
                        <div
                            key={member?.resumeId || member?.memberId}
                            className="bg-white border border-outline rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer"
                            onClick={() => handleOpenProfile(member)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="relative flex-shrink-0">
                                    <div className="w-14 h-14 rounded-2xl bg-primary-soft flex items-center justify-center">
                       <span className="material-symbols-outlined text-primary text-3xl">
                         person
                       </span>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-black text-base group-hover:text-primary transition-colors">
                                            {member?.memberName || '-'}
                                        </h3>
                                    </div>

                                    <p className="text-xs text-on-surface-variant font-medium mb-1">{member?.title || '이력서 제목 없음'}</p>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant mb-3">
                     <span className="flex items-center gap-0.5">
                       <span className="material-symbols-outlined text-sm text-primary">star</span>
                       <span className="font-bold text-on-surface">{Number(member?.ratingAverage || 0).toFixed(1)}</span>
                     </span>
                                        <span className="flex items-center gap-0.5">
                       <span className="material-symbols-outlined text-sm">location_on</span>
                                            {formatPreferredRegions(member?.preferredRegions)}
                     </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {(Array.isArray(member?.desiredBusinessTypes) ? member.desiredBusinessTypes : []).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] font-bold bg-primary-soft text-primary px-2.5 py-0.5 rounded-full"
                                            >
                         {translateBusinessType(tag)}
                       </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeScrap(member?.memberId);
                                        }}
                                        disabled={actionLoadingId === String(member?.memberId)}
                                        className="p-2 rounded-xl hover:bg-primary-soft transition-colors disabled:opacity-50"
                                        title="스크랩 해제"
                                    >
                     <span
                         className="material-symbols-outlined text-primary text-xl"
                         style={{ fontVariationSettings: "'FILL' 1" }}
                     >
                       {actionLoadingId === String(member?.memberId) ? 'hourglass_top' : 'bookmark'}
                     </span>
                                    </button>
                                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors" disabled>
                     <span className="material-symbols-outlined text-on-surface-variant text-xl">
                       chat
                     </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                        disabled={page <= 0}
                        className="px-3 py-1.5 text-sm rounded-lg border border-outline disabled:opacity-50"
                    >
                        이전
                    </button>
                    <span className="text-sm text-on-surface-variant">{page + 1} / {totalPages}</span>
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                        disabled={page >= totalPages - 1}
                        className="px-3 py-1.5 text-sm rounded-lg border border-outline disabled:opacity-50"
                    >
                        다음
                    </button>
                </div>
            )}

            <div className="mt-6 p-5 rounded-2xl bg-primary-soft/40 border border-primary/10 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5 text-sm">info</span>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                    회원 정보를 클릭하면 인재 상세 페이지로 이동합니다. (이력서 공개 시에만 가능)
                    북마크 아이콘을 클릭하면 스크랩이 해제됩니다.
                </p>
            </div>
        </>
    );
}