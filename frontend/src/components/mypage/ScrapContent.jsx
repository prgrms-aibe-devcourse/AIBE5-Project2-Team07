import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyScrapRecruitPage, removeRecruitScrap } from '../../services/scrapRecruitApi';
import { getStoredMember } from '../../services/authApi';

const SALARY_TYPE_LABELS = {
    HOURLY: '시급',
    MONTHLY: '월급',
};

const WORK_PERIOD_LABELS = {
    OneDay: '하루',
    OneWeek: '1주 이하',
    OneMonth: '1개월 이하',
    ThreeMonths: '3개월 이하',
    SixMonths: '6개월 이하',
    OneYear: '1년 이하',
    MoreThanOneYear: '1년 이상'

};

const RECRUIT_STATUS_LABELS = {
    OPEN: '모집 중',
    RECRUITING: '마감',
    CLOSED: '기간 만료 마감',
};

function getSalaryTypeLabel(type) {
    return SALARY_TYPE_LABELS[type] || type || '-';
}

function getWorkPeriodLabel(period) {
    return WORK_PERIOD_LABELS[period] || period || '-';
}

function formatSalary(salary, salaryType) {
    if (!salary) return '-';
    const num = Number(salary);
    if (isNaN(num)) return `${salary}원`;
    return `${num.toLocaleString()}원`;
}

function getRecruitStatusLabel(status) {
    return RECRUIT_STATUS_LABELS[status] || status || '모집중';
}

export default function ScrapContent() {
    const [scraps, setScraps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const storedMember = getStoredMember();
    const memberId = storedMember?.id ?? null;

    const loadScraps = async () => {
        if (!memberId) return;
        try {
            setLoading(true);
            setError('');
            const result = await getMyScrapRecruitPage(memberId, 0);
            const items = Array.isArray(result?.content) ? result.content : [];
            setScraps(items);
        } catch (err) {
            setError(err.message || '스크랩 공고를 불러오지 못했습니다.');
            setScraps([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadScraps();
    }, [memberId]);

    const handleRemoveScrap = async (recruitId) => {
        try {
            setActionLoadingId(recruitId);
            await removeRecruitScrap(memberId, recruitId);
            setScraps((prev) => prev.filter((item) => item.recruit?.id !== recruitId));
        } catch (err) {
            setError(err.message || '스크랩 해제 중 오류가 발생했습니다.');
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <section className="flex-grow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#1F1D1D]">스크랩 공고</h1>
                    <p className="text-[#6B6766] mt-1 text-sm">관심 있는 공고를 저장하고 한눈에 확인하세요.</p>
                </div>
                <span className="bg-[#FFF0F3] text-primary text-sm font-bold px-4 py-2 rounded-xl border border-primary/10 self-start sm:self-auto">
                    총 {scraps.length}개
                </span>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm font-medium text-red-600 mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="bg-white border border-[#EAE5E3] rounded-2xl p-8 text-sm text-[#6B6766] shadow-sm">
                    스크랩 공고를 불러오는 중...
                </div>
            ) : scraps.length === 0 ? (
                <div className="bg-white border border-[#EAE5E3] rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-16 h-16 bg-[#FFF0F3] rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">bookmark</span>
                    </div>
                    <p className="font-bold text-[#1F1D1D] mb-1">스크랩한 공고가 없습니다</p>
                    <p className="text-sm text-[#6B6766]">마음에 드는 공고를 스크랩해 보세요.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {scraps.map((scrap) => {
                        const recruit = scrap.recruit || {};
                        const recruitId = recruit.id;
                        const isRemoving = actionLoadingId === recruitId;

                        return (
                            <div
                                key={recruitId}
                                className="bg-white border border-[#EAE5E3] rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all group shadow-sm"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#FFF0F3] rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/10">
                                        <span className="material-symbols-outlined text-primary text-2xl">apartment</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                            <p className="text-xs text-[#6B6766] font-bold">{recruit.companyName || '-'}</p>
                                            <span className={`text-[13px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                                recruit.status === 'CLOSED' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
                                            }`}>
                                                {getRecruitStatusLabel(recruit.status)}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-[#1F1D1D] group-hover:text-primary transition-colors text-base leading-snug mb-2">
                                            {recruit.title || '공고 제목 없음'}
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {Array.isArray(recruit.workPeriod) && recruit.workPeriod.length > 0 ? (
                                                recruit.workPeriod.map((period) => (
                                                    <span key={period} className="text-[11px] font-bold bg-[#FFF0F3] text-primary px-2.5 py-0.5 rounded-full">
                                        {getWorkPeriodLabel(period)}
                                    </span>
                                                ))
                                            ) : null}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B6766] font-medium">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-primary">payments</span>
                                {recruit.salaryType && recruit.salary ? `${getSalaryTypeLabel(recruit.salaryType)} ${formatSalary(recruit.salary)}` : '-'}
                            </span>
                                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#6B6766]">location_on</span>
                                            {recruit.fullAddress || recruit.regionName || '-'}
                            </span>
                                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-[#6B6766]">calendar_today</span>
                              마감 {recruit.deadline || '-'}
                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleRemoveScrap(recruitId)}
                                            disabled={isRemoving}
                                            className="p-2 rounded-xl hover:bg-[#FFF0F3] transition-colors disabled:opacity-60"
                                            title="스크랩 해제"
                                        >
                            <span
                                className="material-symbols-outlined text-primary text-xl"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              bookmark
                            </span>
                                        </button>
                                        {recruitId && (
                                            <Link
                                                to={`/recruit-detail?recruitId=${recruitId}`}
                                                className="text-xs font-bold text-[#6B6766] hover:text-primary transition-colors flex items-center gap-0.5"
                                            >
                                                상세 보기
                                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="p-5 rounded-2xl bg-[#FFF0F3]/50 border border-primary/10 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5 text-sm">info</span>
                <p className="text-xs text-[#6B6766] font-medium leading-relaxed">
                    북마크 아이콘을 클릭하면 스크랩이 해제됩니다. 마감된 공고는 자동으로 목록에서 제거됩니다.
                </p>
            </div>
        </section>
    );
}