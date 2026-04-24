import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyCompletedWorks, getMyWorks } from '../../services/applyApi';
import { formatDate } from '../../utils/mypageUtils';

const STATUS_FILTERS = [
  { key: 'ALL', label: '전체' },
  { key: 'WORKING', label: '근무 중' },
  { key: 'COMPLETED', label: '근무 완료' },
];

const TYPE_TABS = [
  { key: 'ALL', label: '전체' },
  { key: 'APPLY', label: '지원' },
  { key: 'OFFER', label: '제의' },
];

function getStatusText(status) {
  if (status === 'ACCEPTED') return '근무 중';
  if (status === 'COMPLETED') return '근무 완료';
  return status || '-';
}

export default function WorkContent({ account }) {
  const memberId = account?.id ?? null;
  const [typeTab, setTypeTab] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadWorks = useCallback(async () => {
    if (!memberId) return;
    try {
      setLoading(true);
      setError('');

      const typeParam = typeTab === 'ALL' ? undefined : typeTab;
      const [workingRes, completedRes] = await Promise.all([
        getMyWorks(memberId, { page: 0, size: 50, type: typeParam }),
        getMyCompletedWorks(memberId, { page: 0, size: 50, type: typeParam }),
      ]);

      const workingItems = Array.isArray(workingRes?.content) ? workingRes.content : [];
      const completedItems = Array.isArray(completedRes?.content) ? completedRes.content : [];

      setWorks(
        [...workingItems, ...completedItems].sort(
          (a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime(),
        ),
      );
    } catch (err) {
      setError(err.message || '근무 내역을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [memberId, typeTab]);

  useEffect(() => {
    loadWorks();
  }, [loadWorks]);

  // 탭이 바뀌면 상태 필터 초기화
  const handleTypeTab = (key) => {
    setTypeTab(key);
    setStatusFilter('ALL');
  };

  const filteredWorks = useMemo(() => {
    if (statusFilter === 'ALL') return works;
    if (statusFilter === 'WORKING') return works.filter((item) => item.status === 'ACCEPTED');
    return works.filter((item) => item.status === 'COMPLETED');
  }, [statusFilter, works]);

  return (
    <section className="flex-grow">
      {/* 헤더 — ResumeContent 스타일 */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1F1D1D]">근무 관리</h1>
        <p className="text-[#6B6766] mt-1 text-sm">
          수락된 근무와 완료된 근무를 조회하고 필터링할 수 있습니다.
        </p>
      </div>

      {/* 지원 / 제의 / 전체 탭 */}
      <div className="flex gap-2 border-b border-[#EAE5E3] mb-5">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTypeTab(tab.key)}
            className={`relative px-6 py-3 text-sm font-bold transition-colors ${
              typeTab === tab.key ? 'text-primary' : 'text-[#6B6766] hover:text-[#1D1D1D]'
            }`}
          >
            {tab.label}
            {typeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* 상태 필터 (전체 / 근무 중 / 근무 완료) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setStatusFilter(filter.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              statusFilter === filter.key
                ? 'bg-[#FFF0F3] border-primary/30 text-primary'
                : 'bg-white border-[#EAE5E3] text-[#6B6766] hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm font-medium text-red-600 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-[#EAE5E3] rounded-2xl p-8 text-sm text-[#6B6766] shadow-sm">
          근무 내역을 불러오는 중...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredWorks.length > 0 ? (
            filteredWorks.map((item) => (
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
                    <p className="text-sm text-[#6B6766]">시작일: {formatDate(item.createdAt)}</p>
                    {item.recruitId && (
                      <Link
                        to={`/recruit-detail?recruitId=${item.recruitId}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-0.5"
                      >
                        공고 상세 보기
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                      </Link>
                    )}
                  </div>

                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'COMPLETED'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {getStatusText(item.status)}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="bg-white border border-[#EAE5E3] rounded-2xl p-8 text-sm text-[#6B6766] shadow-sm">
              조건에 맞는 근무 내역이 없습니다.
            </div>
          )}
        </div>
      )}
    </section>
  );
}