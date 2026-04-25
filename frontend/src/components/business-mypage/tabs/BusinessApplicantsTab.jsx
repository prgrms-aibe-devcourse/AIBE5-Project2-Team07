import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMyBusinessRecruits } from '../../../services/accountApi';
import {
    cancelBusinessApply,
    decideBusinessApplication,
    getBusinessApplications,
    getBusinessOffers,
} from '../../../services/applyApi';
import TalentProfilePageCopied from './TalentProfilePageCopied';

const PAGE_SIZE = 10;

const TYPE_TABS = [
    { key: 'APPLICATIONS', label: '받은 지원' },
    { key: 'OFFERS', label: '보낸 제의' },
];

const statusTextMap = {
    PENDING: '대기 중',
    ACCEPTED: '수락',
    REJECTED: '거절',
    COMPLETED: '완료',
};

const formatDateTime = (value) => {
    if (!value) return '-';
    const raw = String(value).trim();
    if (!raw) return '-';
    return raw.replace('T', ' ').slice(0, 16);
};

function statusBadgeClass(status) {
    if (status === 'PENDING') return 'bg-[#FFF0F3] text-primary';
    if (status === 'ACCEPTED') return 'bg-green-50 text-green-700';
    if (status === 'REJECTED') return 'bg-gray-100 text-gray-600';
    if (status === 'COMPLETED') return 'bg-blue-50 text-blue-700';
    return 'bg-gray-100 text-gray-600';
}

export default function BusinessApplicantsTab() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const selectedResumeId = searchParams.get('resumeId');
    const selectedApplyId = searchParams.get('applyId');
    const selectedApplyStatus = searchParams.get('applyStatus');
    const selectedApplyType = searchParams.get('applyType');

    const [activeType, setActiveType] = useState('APPLICATIONS');
    const [selectedRecruitId, setSelectedRecruitId] = useState(searchParams.get('recruitId') || '');
    const [recruitOptions, setRecruitOptions] = useState([]);

    const [rows, setRows] = useState([]);
    const [selectedApplyRow, setSelectedApplyRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [pendingDecisions, setPendingDecisions] = useState({});

    useEffect(() => {
        let mounted = true;

        const loadRecruits = async () => {
            try {
                const data = await getMyBusinessRecruits();
                if (!mounted) return;
                setRecruitOptions(Array.isArray(data) ? data : []);
            } catch {
                if (!mounted) return;
                setRecruitOptions([]);
            }
        };

        loadRecruits();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        let mounted = true;

        const loadRows = async () => {
            try {
                setLoading(true);
                setError('');
                setMessage('');

                const params = {
                    page: Math.max(0, currentPage - 1),
                    size: PAGE_SIZE,
                    recruitId: selectedRecruitId || undefined,
                };

                const response = activeType === 'APPLICATIONS'
                    ? await getBusinessApplications(params)
                    : await getBusinessOffers(params);

                if (!mounted) return;
                setRows(Array.isArray(response?.content) ? response.content : []);
                setTotalPages(Number.isFinite(response?.totalPages) ? response.totalPages : 0);
            } catch (fetchError) {
                if (!mounted) return;
                setRows([]);
                setTotalPages(0);
                setError(fetchError?.message || '목록을 불러오지 못했습니다.');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadRows();

        return () => {
            mounted = false;
        };
    }, [activeType, currentPage, selectedRecruitId]);

    useEffect(() => {
        setCurrentPage(1);
        setPendingDecisions({});
    }, [activeType, selectedRecruitId]);

    const headerDescription = useMemo(() => {
        if (!selectedRecruitId) return '전체 공고 기준으로 제의/지원 현황을 보여줍니다.';
        const selectedRecruit = recruitOptions.find((item) => String(item?.id) === String(selectedRecruitId));
        return `선택 공고: ${selectedRecruit?.title || `#${selectedRecruitId}`}`;
    }, [recruitOptions, selectedRecruitId]);

    const openApplicantDetail = (item) => {
        const resumeId = item?.resumeId;
        const applyId = item?.id;
        const applyStatus = item?.status;
        if (!resumeId) return;

        setSelectedApplyRow(item);

        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('tab', 'applicants');
        nextParams.set('resumeId', String(resumeId));
        if (applyId) nextParams.set('applyId', String(applyId));
        if (applyStatus) nextParams.set('applyStatus', String(applyStatus));
        nextParams.set('applyType', activeType);

        navigate(`/dashboard?${nextParams.toString()}`);
    };

    const closeApplicantDetail = () => {
        setSelectedApplyRow(null);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('tab', 'applicants');
        nextParams.delete('resumeId');
        nextParams.delete('applyId');
        nextParams.delete('applyStatus');
        nextParams.delete('applyType');
        navigate(`/dashboard?${nextParams.toString()}`);
    };

    const handleDecisionComplete = (applyId, nextStatus) => {
        setRows((prev) => prev.map((item) => (
            String(item?.id) === String(applyId)
                ? { ...item, status: nextStatus }
                : item
        )));
    };

    const handleSaveDecision = async (applyId) => {
        const accept = pendingDecisions[applyId];
        if (accept === undefined) return;

        const ok = window.confirm(accept ? '선택한 지원을 수락할까요?' : '선택한 지원을 거절할까요?');
        if (!ok) return;

        try {
            setActionLoadingId(applyId);
            setError('');
            setMessage('');

            await decideBusinessApplication(applyId, accept);
            const nextStatus = accept ? 'ACCEPTED' : 'REJECTED';

            setRows((prev) => prev.map((item) => (
                item.id === applyId ? { ...item, status: nextStatus } : item
            )));
            setPendingDecisions((prev) => {
                const next = { ...prev };
                delete next[applyId];
                return next;
            });
            setMessage(accept ? '지원을 수락했습니다.' : '지원을 거절했습니다.');
        } catch (actionError) {
            setError(actionError?.message || '상태 변경에 실패했습니다.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleCancelOffer = async (applyId) => {
        const ok = window.confirm('보낸 제의를 취소할까요?');
        if (!ok) return;

        try {
            setActionLoadingId(applyId);
            setError('');
            setMessage('');
            await cancelBusinessApply(applyId);
            setRows((prev) => prev.filter((item) => item.id !== applyId));
            setMessage('제의를 취소했습니다.');
        } catch (actionError) {
            setError(actionError?.message || '제의 취소에 실패했습니다.');
        } finally {
            setActionLoadingId(null);
        }
    };

    if (selectedResumeId) {
        const selectedFromRows = rows.find((item) => String(item?.id) === String(selectedApplyId));
        const selectedRow = selectedFromRows || selectedApplyRow;

        return (
            <TalentProfilePageCopied
                resumeId={selectedResumeId}
                applyId={selectedApplyId}
                applyStatus={selectedApplyStatus}
                applyMessage={selectedRow?.message || ''}
                canDecide={selectedApplyType !== 'OFFERS'}
                onBack={closeApplicantDetail}
                onDecisionComplete={handleDecisionComplete}
            />
        );
    }

    return (
        <>
            <header className="mb-6 space-y-4">
                <div>
                    <h2 className="text-2xl font-black text-on-surface">제의/지원 현황</h2>
                    <p className="text-sm text-on-surface-variant mt-1">{headerDescription}</p>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex items-center gap-2 border-b border-[#EAE5E3]">
                        {TYPE_TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveType(tab.key)}
                                className={`relative px-5 py-2.5 text-sm font-bold transition-colors ${
                                    activeType === tab.key ? 'text-primary' : 'text-[#6B6766] hover:text-[#1F1D1D]'
                                }`}
                            >
                                {tab.label}
                                {activeType === tab.key && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    <label className="relative w-full lg:w-96">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-primary">assignment</span>
                        <select
                            value={selectedRecruitId}
                            onChange={(event) => setSelectedRecruitId(event.target.value)}
                            className="w-full appearance-none rounded-2xl border border-primary/20 bg-white pl-10 pr-10 py-2.5 text-sm font-medium text-on-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="">전체 공고</option>
                            {recruitOptions.map((recruit) => (
                                <option key={recruit?.id} value={recruit?.id}>
                                    {recruit?.title || `공고 #${recruit?.id}`}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
                    </label>
                </div>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm font-medium text-red-600 mb-4">
                    {error}
                </div>
            )}
            {message && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm font-medium text-green-700 mb-4">
                    {message}
                </div>
            )}

            <section className="bg-white border border-outline rounded-2xl overflow-hidden">
                {loading && (
                    <div className="p-10 text-center text-on-surface-variant">목록을 불러오는 중입니다.</div>
                )}

                {!loading && !error && rows.length === 0 && (
                    <div className="p-10 text-center text-on-surface-variant">
                        {activeType === 'APPLICATIONS' ? '지원 내역이 없습니다.' : '보낸 제의 내역이 없습니다.'}
                    </div>
                )}

                {!loading && !error && rows.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1120px]">
                            <thead className="bg-[#F8F9FA]">
                            <tr className="text-left text-xs font-bold text-on-surface-variant">
                                <th className="px-5 py-3">지원자명</th>
                                <th className="px-5 py-3">공고명</th>
                                <th className="px-5 py-3">구분</th>
                                <th className="px-5 py-3">상태</th>
                                <th className="px-5 py-3">일시</th>
                                <th className="px-5 py-3">추가메시지</th>
                                <th className="px-5 py-3">처리</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map((item) => {
                                const status = String(item?.status || '').toUpperCase();
                                const rowResumeId = item?.resumeId;
                                const canDecide = activeType === 'APPLICATIONS' && status === 'PENDING';
                                const isActionLoading = actionLoadingId === item?.id;

                                return (
                                    <tr
                                        key={item?.id || `${item?.individualName}-${item?.createdAt || ''}`}
                                        className={`border-t border-outline text-sm text-on-surface ${rowResumeId ? 'cursor-pointer hover:bg-primary-soft/40' : ''}`}
                                        onClick={() => openApplicantDetail(item)}
                                    >
                                        <td className="px-5 py-4 font-semibold">{item?.individualName || '-'}</td>
                                        <td className="px-5 py-4 text-on-surface-variant">{item?.recruitTitle || '-'}</td>
                                        <td className="px-5 py-4 text-on-surface-variant">{activeType === 'APPLICATIONS' ? '지원' : '제의'}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeClass(status)}`}>
                                                {statusTextMap[status] || status || '-'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-on-surface-variant">{formatDateTime(item?.createdAt)}</td>
                                        <td className="px-5 py-4 text-on-surface-variant max-w-[240px]">
                                            <p className="truncate" title={item?.message || ''}>
                                                {item?.message || '-'}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4" onClick={(event) => event.stopPropagation()}>
                                            {canDecide ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPendingDecisions((prev) => ({ ...prev, [item.id]: true }))}
                                                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${pendingDecisions[item.id] === true ? 'bg-primary text-white border-primary' : 'bg-white border-primary text-primary'}`}
                                                    >
                                                        수락
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPendingDecisions((prev) => ({ ...prev, [item.id]: false }))}
                                                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${pendingDecisions[item.id] === false ? 'bg-gray-600 text-white border-gray-600' : 'bg-white border-outline text-on-surface-variant'}`}
                                                    >
                                                        거절
                                                    </button>
                                                    {pendingDecisions[item.id] !== undefined && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSaveDecision(item.id)}
                                                            disabled={isActionLoading}
                                                            className="px-3 py-1.5 rounded-lg bg-[#1F1D1D] text-white text-xs font-bold disabled:opacity-60"
                                                        >
                                                            {isActionLoading ? '저장 중...' : '저장'}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : activeType === 'OFFERS' && status === 'PENDING' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancelOffer(item.id)}
                                                    disabled={isActionLoading}
                                                    className="px-3 py-1.5 rounded-lg border border-outline text-xs font-bold text-on-surface-variant hover:text-red-500 hover:border-red-200 disabled:opacity-60"
                                                >
                                                    {isActionLoading ? '처리 중...' : '취소'}
                                                </button>
                                            ) : (
                                                <span className="text-xs text-on-surface-variant">-</span>
                                            )}
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
        </>
    );
}