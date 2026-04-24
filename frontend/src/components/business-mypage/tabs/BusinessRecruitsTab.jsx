import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    deleteMyBusinessRecruit,
    getMyBusinessRecruits,
    updateMyBusinessRecruitStatus,
} from '../../../services/accountApi';
import { getBusinessApplications } from '../../../services/applyApi';
import RecruitDetailPage from './RecruitDetailPageCopied';

const STATUS_LABEL_MAP = {
    OPEN: '모집 중',
    CLOSED: '마감',
    EXPIRED: '마감',
};

const RECRUIT_FILTER = {
    ALL: 'ALL',
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
};

const ITEMS_PER_PAGE = 10;

const EMPTY_MESSAGE_BY_FILTER = {
    [RECRUIT_FILTER.ALL]: '공고가 없습니다',
    [RECRUIT_FILTER.OPEN]: '모집 중 공고가 없습니다',
    [RECRUIT_FILTER.CLOSED]: '마감된 공고가 없습니다',
};

const formatDate = (value) => {
    if (!value) return '-';
    const raw = String(value).trim();
    if (!raw) return '-';
    const datePart = raw.split('T')[0].split(' ')[0];
    return datePart.replace(/-/g, '.');
};

export default function BusinessRecruitsTab() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedRecruitId = searchParams.get('recruitId');
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState(RECRUIT_FILTER.ALL);
    const [currentPage, setCurrentPage] = useState(1);
    const [recruits, setRecruits] = useState([]);
    const [pendingApplicantsCount, setPendingApplicantsCount] = useState(0);
    const [applicantsCountByRecruitId, setApplicantsCountByRecruitId] = useState({});
    const [loading, setLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [error, setError] = useState('');

    const fetchRecruits = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getMyBusinessRecruits();
            setRecruits(Array.isArray(data) ? data : []);
        } catch (fetchError) {
            setRecruits([]);
            setError(fetchError?.message || '공고 목록을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSafely = async () => {
            try {
                await fetchRecruits();
            } catch {
                // fetchRecruits 내부에서 에러 상태를 처리합니다.
            }
        };

        fetchSafely();
    }, []);

    useEffect(() => {
        let mounted = true;

        const fetchPendingApplicantsCount = async () => {
            try {
                const firstPage = await getBusinessApplications({ page: 0, size: 50 });
                const firstContent = Array.isArray(firstPage?.content) ? firstPage.content : [];
                const totalPages = Number.isFinite(firstPage?.totalPages) ? firstPage.totalPages : 1;

                const allApplications = [...firstContent];

                let pendingCount = firstContent.filter((item) => String(item?.status || '').toUpperCase() === 'PENDING').length;

                for (let page = 1; page < totalPages; page += 1) {
                    const pageResponse = await getBusinessApplications({ page, size: 50 });
                    const pageContent = Array.isArray(pageResponse?.content) ? pageResponse.content : [];
                    allApplications.push(...pageContent);
                    pendingCount += pageContent.filter((item) => String(item?.status || '').toUpperCase() === 'PENDING').length;
                }

                const countMap = {};
                allApplications.forEach((item) => {
                    const key = String(item?.recruitId || '');
                    if (!key) return;
                    countMap[key] = (countMap[key] || 0) + 1;
                });

                if (mounted) {
                    setPendingApplicantsCount(pendingCount);
                    setApplicantsCountByRecruitId(countMap);
                }
            } catch {
                if (mounted) {
                    setPendingApplicantsCount(0);
                    setApplicantsCountByRecruitId({});
                }
            }
        };

        fetchPendingApplicantsCount();

        return () => {
            mounted = false;
        };
    }, []);

    const filteredRecruits = useMemo(() => {
        const statusFiltered = recruits.filter((item) => {
            const status = String(item?.status || '').toUpperCase();
            if (statusFilter === RECRUIT_FILTER.OPEN) return status === 'OPEN';
            if (statusFilter === RECRUIT_FILTER.CLOSED) return status === 'CLOSED' || status === 'EXPIRED';
            return true;
        });

        const q = keyword.trim().toLowerCase();
        if (!q) return statusFiltered;

        return statusFiltered.filter((item) => {
            const title = String(item?.title || '').toLowerCase();
            const region = String(item?.regionName || '').toLowerCase();
            return title.includes(q) || region.includes(q);
        });
    }, [keyword, recruits, statusFilter]);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredRecruits.length / ITEMS_PER_PAGE));
    }, [filteredRecruits.length]);

    const paginatedRecruits = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRecruits.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredRecruits, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [keyword, statusFilter]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const stats = useMemo(() => {
        const total = recruits.length;
        const open = recruits.filter((item) => String(item?.status || '').toUpperCase() === 'OPEN').length;
        const closed = recruits.filter((item) => {
            const status = String(item?.status || '').toUpperCase();
            return status === 'CLOSED' || status === 'EXPIRED';
        }).length;

        return { total, open, closed, pendingApplicants: pendingApplicantsCount };
    }, [recruits, pendingApplicantsCount]);

    const openRecruitDetail = (recruitId) => {
        if (!recruitId) return;
        navigate(`/recruit-detail?recruitId=${encodeURIComponent(recruitId)}`);
    };

    const openRecruitManagementDetail = (recruitId) => {
        if (!recruitId) return;
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('tab', 'recruits');
        nextParams.set('recruitId', String(recruitId));
        navigate(`/dashboard?${nextParams.toString()}`);
    };

    const closeRecruitDetail = () => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('tab', 'recruits');
        nextParams.delete('recruitId');
        setSearchParams(nextParams);
    };

    const goToApplicantsTab = () => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('tab', 'applicants');
        navigate(`/dashboard?${nextParams.toString()}`);
    };

    const handleRecruitDelete = async (recruitId) => {
        if (!recruitId || actionLoadingId) return;
        const ok = window.confirm('해당 공고를 삭제할까요? 삭제 후에는 복구할 수 없습니다.');
        if (!ok) return;

        try {
            setActionLoadingId(String(recruitId));
            await deleteMyBusinessRecruit(recruitId);
            window.alert('공고가 삭제되었습니다.');
            await fetchRecruits();
        } catch (actionError) {
            window.alert(actionError?.message || '공고 삭제에 실패했습니다.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleRecruitStatusToggle = async (recruitId, currentStatus) => {
        if (!recruitId || actionLoadingId) return;
        const normalized = String(currentStatus || '').toUpperCase();
        const nextStatus = normalized === 'OPEN' ? 'CLOSED' : 'OPEN';
        const ok = window.confirm(`공고 상태를 ${nextStatus === 'OPEN' ? '모집 중' : '마감'}으로 변경할까요?`);
        if (!ok) return;

        try {
            setActionLoadingId(String(recruitId));
            await updateMyBusinessRecruitStatus(recruitId, nextStatus);
            window.alert('공고 상태가 변경되었습니다.');
            await fetchRecruits();
        } catch (actionError) {
            window.alert(actionError?.message || '공고 상태 변경에 실패했습니다.');
        } finally {
            setActionLoadingId(null);
        }
    };

    if (selectedRecruitId) {
        return (
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={closeRecruitDetail}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline bg-white text-sm font-bold hover:bg-gray-50"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    공고 목록으로
                </button>

                <RecruitDetailPage embedded />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-on-surface">공고 관리</h1>
                    <p className="text-sm text-on-surface-variant">
                        작성하신 공고 현황을 확인하고 제의/지원자를 관리하세요.
                    </p>
                </div>
                <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
                    <input
                        className="w-full bg-white border border-outline rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        placeholder="공고명 검색"
                        type="text"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                    />
                </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                    type="button"
                    onClick={() => {
                        setStatusFilter(RECRUIT_FILTER.ALL);
                        setCurrentPage(1);
                    }}
                    aria-pressed={statusFilter === RECRUIT_FILTER.ALL}
                    className={`text-left bg-white border rounded-2xl p-5 transition-colors ${statusFilter === RECRUIT_FILTER.ALL ? 'border-primary ring-1 ring-primary/30' : 'border-outline hover:border-primary/40'}`}
                >
                    <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        전체 공고
                    </p>
                    <p className="text-2xl font-black text-on-surface">{stats.total}</p>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setStatusFilter(RECRUIT_FILTER.OPEN);
                        setCurrentPage(1);
                    }}
                    aria-pressed={statusFilter === RECRUIT_FILTER.OPEN}
                    className={`text-left bg-white border rounded-2xl p-5 transition-colors ${statusFilter === RECRUIT_FILTER.OPEN ? 'border-primary border-l-4 border-l-primary ring-1 ring-primary/30' : 'border-outline hover:border-primary/40'}`}
                >
                    <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        모집 중
                    </p>
                    <p className="text-2xl font-black text-primary">{stats.open}</p>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setStatusFilter(RECRUIT_FILTER.CLOSED);
                        setCurrentPage(1);
                    }}
                    aria-pressed={statusFilter === RECRUIT_FILTER.CLOSED}
                    className={`text-left bg-white border rounded-2xl p-5 transition-colors ${statusFilter === RECRUIT_FILTER.CLOSED ? 'border-primary ring-1 ring-primary/30' : 'border-outline hover:border-primary/40'}`}
                >
                    <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        마감됨
                    </p>
                    <p className="text-2xl font-black text-on-surface">{stats.closed}</p>
                </button>
                <button
                    type="button"
                    onClick={goToApplicantsTab}
                    aria-label="대기중인 지원자 목록으로 이동"
                    className="text-left bg-white border border-outline rounded-2xl p-5 hover:border-primary/40 transition-colors"
                >
                    <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        대기중인 지원자
                    </p>
                    <p className="text-2xl font-black text-[#6c46ad]">{stats.pendingApplicants}</p>
                </button>
            </section>

            <section className="bg-white border border-outline rounded-2xl overflow-hidden">
                {loading && (
                    <div className="p-10 text-center text-on-surface-variant">공고 목록을 불러오는 중입니다.</div>
                )}

                {!loading && error && (
                    <div className="p-10 text-center text-red-500">{error}</div>
                )}

                {!loading && !error && filteredRecruits.length === 0 && (
                    <div className="p-10 text-center text-on-surface-variant">{EMPTY_MESSAGE_BY_FILTER[statusFilter] || '공고가 없습니다'}</div>
                )}

                {!loading && !error && filteredRecruits.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1020px]">
                            <thead className="bg-[#F8F9FA]">
                                <tr className="text-left text-xs font-bold text-on-surface-variant">
                                    <th className="px-5 py-3">공고명</th>
                                    <th className="px-5 py-3">근무지</th>
                                    <th className="px-5 py-3">상태</th>
                                    <th className="px-5 py-3">총 지원</th>
                                    <th className="px-5 py-3">마감일</th>
                                    <th className="px-5 py-3">등록일</th>
                                    <th className="px-5 py-3">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRecruits.map((item) => {
                                    const status = String(item?.status || '').toUpperCase();
                                    const statusLabel = STATUS_LABEL_MAP[status] || (item?.status || '-');
                                    const recruitId = item?.id;
                                    const isActing = actionLoadingId === String(recruitId);
                                    const applicantsCount = applicantsCountByRecruitId[String(recruitId)] || 0;
                                    return (
                                        <tr
                                            key={item?.id || `${item?.title}-${item?.createdAt || ''}`}
                                            className="border-t border-outline text-sm text-on-surface cursor-pointer hover:bg-primary-soft/40"
                                            onClick={() => {
                                                if (!recruitId) return;
                                                openRecruitDetail(recruitId);
                                            }}
                                        >
                                            <td className="px-5 py-4 font-semibold">{item?.title || '-'}</td>
                                            <td className="px-5 py-4 text-on-surface-variant">{item?.regionName || '-'}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${status === 'OPEN' ? 'bg-primary-soft text-primary' : 'bg-gray-100 text-on-surface-variant'}`}>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-on-surface-variant font-semibold">{applicantsCount}명</td>
                                            <td className="px-5 py-4 text-on-surface-variant">{formatDate(item?.deadline)}</td>
                                            <td className="px-5 py-4 text-on-surface-variant">{formatDate(item?.createdAt)}</td>
                                            <td className="px-5 py-4" onClick={(event) => event.stopPropagation()}>
                                                <div className="flex items-center gap-2 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => openRecruitManagementDetail(recruitId)}
                                                        className="px-2.5 py-1.5 rounded-lg border border-outline text-xs font-bold bg-white hover:bg-gray-50"
                                                    >
                                                        관리
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRecruitStatusToggle(recruitId, item?.status)}
                                                        disabled={isActing}
                                                        className="px-2.5 py-1.5 rounded-lg border border-outline text-xs font-bold bg-white hover:bg-gray-50 disabled:opacity-50"
                                                    >
                                                        {status === 'OPEN' ? '마감' : '재오픈'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRecruitDelete(recruitId)}
                                                        disabled={isActing}
                                                        className="px-2.5 py-1.5 rounded-lg border border-red-200 text-xs font-bold text-red-600 bg-white hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        {isActing ? '처리 중...' : '삭제'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className="px-5 py-4 border-t border-outline flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage <= 1}
                                    className="px-3 py-1.5 text-sm rounded-lg border border-outline disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    이전
                                </button>

                                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        type="button"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-1.5 text-sm rounded-lg border ${currentPage === pageNum ? 'bg-primary text-white border-primary' : 'border-outline hover:border-primary/40'}`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage >= totalPages}
                                    className="px-3 py-1.5 text-sm rounded-lg border border-outline disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    다음
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}