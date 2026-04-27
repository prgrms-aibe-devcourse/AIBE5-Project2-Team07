import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CommonButton from '../CommonButton';
import {
  cancelMyApply,
  decideMyOffer,
  getMyApplications,
  getMyOffers,
} from '../../services/applyApi';
import { formatDate } from '../../utils/mypageUtils';

const STATUS_LABELS = {
  PENDING: '진행 중',
  ACCEPTED: '수락',
  REJECTED: '거절',
  COMPLETED: '근무 완료',
};

function getStatusText(status) {
  return STATUS_LABELS[status] || status || '-';
}

function statusBadgeClass(status) {
  if (status === 'PENDING') return 'bg-[#FFF0F3] text-primary';
  if (status === 'ACCEPTED') return 'bg-green-50 text-green-700';
  if (status === 'REJECTED') return 'bg-gray-100 text-gray-600';
  if (status === 'COMPLETED') return 'bg-blue-50 text-blue-700';
  return 'bg-gray-100 text-gray-600';
}

export default function ApplyStatusContent({ account }) {
  const memberId = account?.id ?? null;

  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  // { [applyId]: true(수락) | false(거절) }
  const [pendingDecisions, setPendingDecisions] = useState({});

  const loadApplications = useCallback(async () => {
    const response = await getMyApplications(memberId, 0, 50);
    return Array.isArray(response?.content) ? response.content : [];
  }, [memberId]);

  const loadOffers = useCallback(async () => {
    const response = await getMyOffers(memberId, { page: 0, size: 50 });
    return Array.isArray(response?.content) ? response.content : [];
  }, [memberId]);

  const loadData = useCallback(async () => {
    if (!memberId) return;

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const [nextApplications, nextOffers] = await Promise.all([
        loadApplications(),
        loadOffers(),
      ]);

      setApplications(nextApplications);
      setOffers(nextOffers);
    } catch (err) {
      setError(err.message || '지원/제의 현황을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [memberId, loadApplications, loadOffers]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeList = useMemo(() => {
    return activeTab === 'applications' ? applications : offers;
  }, [activeTab, applications, offers]);

  const handleCancel = async (applyId) => {
    const ok = window.confirm('해당 지원을 취소하시겠습니까?');
    if (!ok) return;

    try {
      setActionLoadingId(applyId);
      setError('');
      setMessage('');

      await cancelMyApply(applyId, memberId);
      setApplications((prev) => prev.filter((item) => item.id !== applyId));
      setMessage('지원이 취소되었습니다.');
    } catch (err) {
      setError(err.message || '지원 취소 중 오류가 발생했습니다.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDecision = async (applyId) => {
    const accept = pendingDecisions[applyId];
    if (accept === undefined) return;

    try {
      setActionLoadingId(applyId);
      setError('');
      setMessage('');

      await decideMyOffer(applyId, accept, memberId);
      setOffers((prev) =>
        prev.map((item) =>
          item.id === applyId ? { ...item, status: accept ? 'ACCEPTED' : 'REJECTED' } : item,
        ),
      );
      setPendingDecisions((prev) => {
        const next = { ...prev };
        delete next[applyId];
        return next;
      });
      setMessage(accept ? '제의를 수락했습니다.' : '제의를 거절했습니다.');
    } catch (err) {
      setError(err.message || '상태 변경 중 오류가 발생했습니다.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const TABS = [
    { key: 'applications', label: '내가 한 지원' },
    { key: 'offers', label: '내가 받은 제의' },
  ];

  return (
    <section className="flex-grow">
      {/* 헤더 — ResumeContent 스타일 */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1F1D1D]">지원/제의 현황</h1>
        <p className="text-[#6B6766] mt-1 text-sm">
          내가 한 지원은 취소만 가능하고, 받은 제의는 수락·거절할 수 있습니다.
        </p>
      </div>

      {/* 서브 탭 */}
      <div className="flex gap-2 border-b border-[#EAE5E3] mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-6 py-3 text-sm font-bold transition-colors ${
              activeTab === tab.key ? 'text-primary' : 'text-[#6B6766] hover:text-[#1F1D1D]'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

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

      {loading ? (
        <div className="bg-white border border-[#EAE5E3] rounded-2xl p-8 text-sm text-[#6B6766] shadow-sm">
          목록을 불러오는 중...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {activeList.length > 0 ? (
            activeList.map((item) => {
              const canDecide = activeTab === 'offers' && item.status === 'PENDING';
              const isCancelLocked = item.status === 'ACCEPTED' || item.status === 'COMPLETED';
              const canCancel = activeTab === 'applications';
              const isActionLoading = actionLoadingId === item.id;

              return (
                <article
                  key={item.id}
                  className="bg-white border border-[#EAE5E3] p-6 rounded-2xl shadow-sm hover:border-primary/20 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-1.5">
                      <p className="text-xs text-[#6B6766]">지원번호 #{item.id}</p>
                      <h3 className="text-base font-extrabold text-[#1F1D1D]">
                        {item.recruitTitle || '공고 제목 없음'}
                      </h3>
                      <p className="text-sm text-[#6B6766]">기업: {item.companyName || '-'}</p>
                      <p className="text-sm text-[#6B6766]">신청일: {formatDate(item.createdAt)}</p>
                      {item.recruitId && (
                        <Link
                          to={`/recruit-detail?recruitId=${item.recruitId}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-0.5"
                        >
                          공고 상세 보기
                          <span className="material-symbols-outlined text-xs">chevron_right</span>
                        </Link>
                      )}
                      {item.attachedFileUrl ? (
                        <a
                          href={item.attachedFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mt-0.5"
                        >
                          <span className="material-symbols-outlined text-xs">attach_file</span>
                          첨부 이력서 보기
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-0.5 cursor-not-allowed select-none">
                          <span className="material-symbols-outlined text-xs">attach_file</span>
                          첨부파일 없음
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeClass(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>

                      {canDecide && (
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setPendingDecisions((prev) => ({ ...prev, [item.id]: true }))
                              }
                              disabled={isActionLoading}
                              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors disabled:opacity-60 ${
                                pendingDecisions[item.id] === true
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-white text-primary border-primary hover:bg-[#FFF0F3]'
                              }`}
                            >
                              수락
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setPendingDecisions((prev) => ({ ...prev, [item.id]: false }))
                              }
                              disabled={isActionLoading}
                              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors disabled:opacity-60 ${
                                pendingDecisions[item.id] === false
                                  ? 'bg-gray-600 text-white border-gray-600'
                                  : 'bg-white text-[#6B6766] border-[#EAE5E3] hover:bg-gray-100'
                              }`}
                            >
                              거절
                            </button>
                          </div>
                          {pendingDecisions[item.id] !== undefined && (
                            <button
                              type="button"
                              onClick={() => handleDecision(item.id)}
                              disabled={isActionLoading}
                              className="px-5 py-2 rounded-xl bg-[#1F1D1D] text-white text-xs font-bold hover:bg-black transition-colors disabled:opacity-60"
                            >
                              {isActionLoading ? '처리 중...' : '저장'}
                            </button>
                          )}
                        </div>
                      )}

                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => !isCancelLocked && handleCancel(item.id)}
                          disabled={isActionLoading || isCancelLocked}
                          title={isCancelLocked ? '수락 또는 완료된 지원은 취소할 수 없습니다.' : undefined}
                          className={`px-4 py-2 rounded-xl border text-xs font-bold transition-colors ${
                            isCancelLocked
                              ? 'border-[#EAE5E3] text-gray-300 cursor-not-allowed bg-gray-50'
                              : 'border-[#EAE5E3] text-[#6B6766] hover:text-red-500 hover:border-red-200 disabled:opacity-60'
                          }`}
                        >
                          취소
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="bg-white border border-[#EAE5E3] rounded-2xl p-8 text-sm text-[#6B6766] shadow-sm">
              {activeTab === 'applications' ? '내가 한 지원 내역이 없습니다.' : '받은 제의 내역이 없습니다.'}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
