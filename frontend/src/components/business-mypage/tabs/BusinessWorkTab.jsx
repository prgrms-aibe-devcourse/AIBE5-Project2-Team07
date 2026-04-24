import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyBusinessRecruits } from '../../../services/accountApi';
import {
    completeBusinessApply,
    getBusinessCompletedWorks,
    getBusinessWorks,
} from '../../../services/applyApi';

const TYPE_TABS = [
    { key: 'ALL', label: '전체' },
    { key: 'APPLY', label: '지원' },
    { key: 'OFFER', label: '제의' },
];

const STATUS_FILTERS = [
    { key: 'ALL', label: '전체' },
    { key: 'WORKING', label: '근무 중' },
    { key: 'COMPLETED', label: '근무 완료' },
];

const PERIOD_LABELS = {
    OneDay: '하루',
    OneWeek: '1주 이하',
    OneMonth: '1개월 이하',
    ThreeMonths: '3개월 이하',
    SixMonths: '6개월 이하',
    OneYear: '1년 이하',
    MoreThanOneYear: '1년 이상',
};

const DAY_LABELS = {
    MON: '월',
    TUE: '화',
    WED: '수',
    THU: '목',
    FRI: '금',
    SAT: '토',
    SUN: '일',
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
    FULLTIME: '풀타임',
};

function formatEnumList(values, labelMap) {
    if (!Array.isArray(values) || values.length === 0) return '-';
    return values.map((value) => labelMap[value] || value).join(', ');
}

function getStatusText(status) {
    if (status === 'ACCEPTED') return '근무 중';
    if (status === 'COMPLETED') return '근무 완료';
    return status || '-';
}

export default function BusinessWorkTab() {
    const [typeTab, setTypeTab] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedRecruitId, setSelectedRecruitId] = useState('');

    const [recruitOptions, setRecruitOptions] = useState([]);
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [pendingCompleteId, setPendingCompleteId] = useState(null);
    const [savingComplete, setSavingComplete] = useState(false);

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

        const loadWorks = async () => {
            try {
                setLoading(true);
                setError('');
                setMessage('');

                const typeParam = typeTab === 'ALL' ? undefined : typeTab;
                const recruitIdParam = selectedRecruitId || undefined;

                const [workingRes, completedRes] = await Promise.all([
                    getBusinessWorks({ page: 0, size: 50, type: typeParam, recruitId: recruitIdParam }),
                    getBusinessCompletedWorks({ page: 0, size: 50, type: typeParam, recruitId: recruitIdParam }),
                ]);

                if (!mounted) return;

                const workingItems = Array.isArray(workingRes?.content) ? workingRes.content : [];
                const completedItems = Array.isArray(completedRes?.content) ? completedRes.content : [];
                const merged = [...workingItems, ...completedItems].sort(
                    (a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime(),
                );

                setWorks(merged);
            } catch (fetchError) {
                if (!mounted) return;
                setWorks([]);
                setError(fetchError?.message || '근무 내역을 불러오지 못했습니다.');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadWorks();
        return () => {
            mounted = false;
        };
    }, [typeTab, selectedRecruitId]);

    useEffect(() => {
        setPendingCompleteId(null);
    }, [typeTab, statusFilter, selectedRecruitId]);

    const filteredWorks = useMemo(() => {
        if (statusFilter === 'ALL') return works;
        if (statusFilter === 'WORKING') return works.filter((item) => item.status === 'ACCEPTED');
        return works.filter((item) => item.status === 'COMPLETED');
    }, [statusFilter, works]);

    const recruitMetaMap = useMemo(() => {
        const map = new Map();
        recruitOptions.forEach((recruit) => {
            map.set(String(recruit?.id), recruit);
        });
        return map;
    }, [recruitOptions]);

    const handleSaveComplete = async () => {
        if (!pendingCompleteId || savingComplete) return;
        const ok = window.confirm('선택한 근무를 근무 완료로 저장할까요?');
        if (!ok) return;

        try {
            setSavingComplete(true);
            setError('');
            setMessage('');

            await completeBusinessApply(pendingCompleteId);
            setWorks((prev) => prev.map((item) => (
                item.id === pendingCompleteId ? { ...item, status: 'COMPLETED' } : item
            )));
            setPendingCompleteId(null);
            setMessage('근무 완료로 저장되었습니다.');
        } catch (saveError) {
            setError(saveError?.message || '근무 완료 저장에 실패했습니다.');
        } finally {
            setSavingComplete(false);
        }
    };

    return (
        <section className="flex-grow">
            <div className="mb-8 space-y-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#1F1D1D]">근무 관리</h1>
                    <p className="text-[#6B6766] mt-1 text-sm">
                        수락된 지원/제의와 근무 완료 내역을 함께 관리합니다.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex gap-2 border-b border-[#EAE5E3]">
                        {TYPE_TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => {
                                    setTypeTab(tab.key);
                                    setStatusFilter('ALL');
                                }}
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

                <div className="flex flex-wrap gap-2">
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

            {pendingCompleteId && (
                <div className="mb-4 bg-[#FFF0F3] border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-on-surface">선택한 건을 근무 완료로 변경하려면 저장을 눌러주세요.</p>
                    <button
                        type="button"
                        onClick={handleSaveComplete}
                        disabled={savingComplete}
                        className="px-4 py-2 rounded-lg bg-[#1F1D1D] text-white text-xs font-bold disabled:opacity-60"
                    >
                        {savingComplete ? '저장 중...' : '저장'}
                    </button>
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
                            (() => {
                                const recruitMeta = recruitMetaMap.get(String(item?.recruitId));
                                const workDaysText = formatEnumList(recruitMeta?.workDays, DAY_LABELS);
                                const workPeriodText = formatEnumList(recruitMeta?.workPeriod, PERIOD_LABELS);
                                const workTimeText = formatEnumList(recruitMeta?.workTime, TIME_LABELS);
                                return (
                            <article
                                key={item.id}
                                className="bg-white border border-[#EAE5E3] p-6 rounded-2xl shadow-sm hover:border-primary/20 transition-all"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="space-y-1.5">
                                        <p className="text-xs text-[#6B6766]">지원번호 #{item.id}</p>
                                        <h3 className="text-base font-extrabold text-[#1F1D1D]">{item.recruitTitle || '공고 제목 없음'}</h3>
                                        <p className="text-sm text-[#6B6766]">지원자: {item.individualName || '-'}</p>
                                        <p className="text-sm text-[#6B6766]">구분: {item.type === 'OFFER' ? '제의' : '지원'}</p>
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

                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold ${
                                                item.status === 'COMPLETED'
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'bg-green-50 text-green-700'
                                            }`}
                                        >
                                            {getStatusText(item.status)}
                                        </span>

                                        {item.status === 'ACCEPTED' && (
                                            <button
                                                type="button"
                                                onClick={() => setPendingCompleteId(item.id)}
                                                className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${
                                                    pendingCompleteId === item.id
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white border-outline text-on-surface-variant'
                                                }`}
                                            >
                                                완료 선택
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                                );
                            })()
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