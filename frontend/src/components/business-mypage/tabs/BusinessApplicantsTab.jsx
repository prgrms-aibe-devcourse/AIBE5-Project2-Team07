import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getBusinessApplications } from '../../../services/applyApi';
import TalentProfilePageCopied from './TalentProfilePageCopied';

const PAGE_SIZE = 10;

const formatDateTime = (value) => {
    if (!value) return '-';
    const raw = String(value).trim();
    if (!raw) return '-';
    return raw.replace('T', ' ').slice(0, 16);
};

const statusTextMap = {
    PENDING: '대기중',
    ACCEPTED: '수락',
    REJECTED: '거절',
    COMPLETED: '완료',
};

export default function BusinessApplicantsTab() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const recruitId = searchParams.get('recruitId');
    const selectedResumeId = searchParams.get('resumeId');
    const selectedApplyId = searchParams.get('applyId');
    const selectedApplyStatus = searchParams.get('applyStatus');

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        let mounted = true;

        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await getBusinessApplications({
                    page: Math.max(0, currentPage - 1),
                    size: PAGE_SIZE,
                    recruitId: recruitId || undefined,
                });

                if (!mounted) return;

                const list = Array.isArray(response?.content) ? response.content : [];
                const pages = Number.isFinite(response?.totalPages) ? response.totalPages : 0;

                setApplications(list);
                setTotalPages(pages);
            } catch (fetchError) {
                if (!mounted) return;
                setApplications([]);
                setTotalPages(0);
                setError(fetchError?.message || '지원자 목록을 불러오지 못했습니다.');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchApplications();

        return () => {
            mounted = false;
        };
    }, [currentPage, recruitId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [recruitId]);

    const headerDescription = useMemo(() => {
        if (!recruitId) return '전체 공고의 지원자 목록입니다.';
        return `선택한 공고(recruitId: ${recruitId})의 지원자만 표시 중입니다.`;
    }, [recruitId]);

    const openApplicantDetail = (resumeId, applyId, applyStatus) => {
        if (!resumeId) return;

        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('tab', 'applicants');
        nextParams.set('resumeId', String(resumeId));
        if (applyId) nextParams.set('applyId', String(applyId));
        if (applyStatus) nextParams.set('applyStatus', String(applyStatus));

        navigate(`/dashboard?${nextParams.toString()}`);
    };

    const closeApplicantDetail = () => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('tab', 'applicants');
        nextParams.delete('resumeId');
        nextParams.delete('applyId');
        nextParams.delete('applyStatus');
        navigate(`/dashboard?${nextParams.toString()}`);
    };

    const handleDecisionComplete = (applyId, nextStatus) => {
        setApplications((prev) => prev.map((item) => (
            String(item?.id) === String(applyId)
                ? { ...item, status: nextStatus }
                : item
        )));
    };

    if (selectedResumeId) {
        return (
            <TalentProfilePageCopied
                resumeId={selectedResumeId}
                applyId={selectedApplyId}
                applyStatus={selectedApplyStatus}
                onBack={closeApplicantDetail}
                onDecisionComplete={handleDecisionComplete}
            />
        );
    }

    return (
        <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
            Management
          </span>
                    <h2 className="text-2xl font-black text-on-surface">지원자 현황</h2>
                    <p className="text-sm text-on-surface-variant mt-1">{headerDescription}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-white border border-outline px-4 py-2 rounded-lg text-on-surface text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-sm">filter_list</span>
                        최신 지원순
                    </button>
                    <button className="bg-primary px-6 py-2 rounded-lg text-white text-sm font-bold hover:bg-primary-deep transition-colors">
                        공고 수정
                    </button>
                </div>
            </header>

            <section className="bg-white border border-outline rounded-2xl overflow-hidden">
                {loading && (
                    <div className="p-10 text-center text-on-surface-variant">지원자 목록을 불러오는 중입니다.</div>
                )}

                {!loading && error && (
                    <div className="p-10 text-center text-red-500">{error}</div>
                )}

                {!loading && !error && applications.length === 0 && (
                    <div className="p-10 text-center text-on-surface-variant">지원자가 없습니다.</div>
                )}

                {!loading && !error && applications.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[880px]">
                            <thead className="bg-[#F8F9FA]">
                            <tr className="text-left text-xs font-bold text-on-surface-variant">
                                <th className="px-5 py-3">지원자명</th>
                                <th className="px-5 py-3">공고명</th>
                                <th className="px-5 py-3">지원 상태</th>
                                <th className="px-5 py-3">지원 일시</th>
                                <th className="px-5 py-3">이력서 ID</th>
                            </tr>
                            </thead>
                            <tbody>
                            {applications.map((item) => {
                                const status = String(item?.status || '').toUpperCase();
                                const rowResumeId = item?.resumeId;
                                return (
                                    <tr
                                        key={item?.id || `${item?.individualName}-${item?.createdAt || ''}`}
                                        className={`border-t border-outline text-sm text-on-surface ${rowResumeId ? 'cursor-pointer hover:bg-primary-soft/40' : ''}`}
                                        onClick={() => openApplicantDetail(rowResumeId, item?.id, item?.status)}
                                    >
                                        <td className="px-5 py-4 font-semibold">{item?.individualName || '-'}</td>
                                        <td className="px-5 py-4 text-on-surface-variant">{item?.recruitTitle || '-'}</td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-primary-soft text-primary">
                                                {statusTextMap[status] || status || '-'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-on-surface-variant">{formatDateTime(item?.createdAt)}</td>
                                        <td className="px-5 py-4 text-on-surface-variant">{item?.resumeId ?? '-'}</td>
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