import React from 'react';
import { Link } from 'react-router-dom';
import {
  BUSINESS_TYPE_OPTIONS,
  OPTION_LABEL_MAP,
  RECOMMEND_DEFAULT_FILTERS,
} from '../constants/recommendFilterOptions';

const businessTypeLabelMap = Object.fromEntries(
  BUSINESS_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

function formatSalary(salary, salaryType) {
  if (salary == null) return '급여 협의';
  const formatted = new Intl.NumberFormat('ko-KR').format(salary);
  const suffix = salaryType === 'MONTHLY' ? '/월' : '/시간';
  return `${formatted}원 ${suffix}`;
}

function formatDeadline(deadline) {
  if (!deadline) return '상시 모집';
  return deadline;
}

function countSelectedConditions(filters = RECOMMEND_DEFAULT_FILTERS) {
  const listCount = [
    filters.workPeriod?.length || 0,
    filters.workDays?.length || 0,
    filters.workTime?.length || 0,
    filters.businessType?.length || 0,
  ].reduce((sum, current) => sum + current, 0);

  return listCount + (filters.regionId ? 1 : 0) + (filters.salaryType ? 1 : 0) + (filters.urgent ? 1 : 0);
}

export default function RecommendJobsSection({ jobs, loading, error, filters }) {
  const selectedCount = countSelectedConditions(filters);
  const selectedSummary = [];

  if (filters.regionName) selectedSummary.push(filters.regionName);
  if (filters.salaryType) selectedSummary.push(OPTION_LABEL_MAP.salaryType[filters.salaryType]);
  if (filters.urgent) selectedSummary.push('긴급 공고');
  if (filters.businessType?.length) {
    selectedSummary.push(...filters.businessType.map((value) => businessTypeLabelMap[value] ?? value));
  }

  return (
    <div className="rounded-[28px] border border-[#ece7e5] bg-white shadow-sm overflow-hidden">
      <div className="border-b border-[#f0ece9] bg-[#fcfaf9] px-6 py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-black text-primary">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              맞춤형 추천 결과
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-on-surface">선택한 조건에 맞는 추천 공고</h3>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              {selectedCount > 0
                ? `${selectedCount}개의 추천 조건을 반영한 결과입니다.`
                : '조건을 넓게 잡아서 전체 범위 기준으로 추천했습니다.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSummary.length > 0 ? (
              selectedSummary.slice(0, 6).map((item) => (
                <span key={item} className="rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">
                  {item}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-outline bg-white px-3 py-1.5 text-xs font-bold text-on-surface-variant">
                조건 전체 보기
              </span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="px-6 py-20 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm font-medium text-on-surface-variant">맞춤형 추천 공고를 불러오는 중입니다.</p>
        </div>
      ) : error ? (
        <div className="px-6 py-10">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <span className="material-symbols-outlined text-[44px] text-outline">search_off</span>
          <h4 className="mt-4 text-lg font-extrabold text-on-surface">조건에 맞는 공고가 없습니다.</h4>
          <p className="mt-2 text-sm text-on-surface-variant">지역을 선택 안함으로 바꾸거나, 업종/시간 조건을 조금 넓혀서 다시 시도해 보세요.</p>
        </div>
      ) : (
        <div>
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#e8e8e8] text-on-surface-variant text-xs font-bold uppercase tracking-wider">
            <div className="col-span-5">기업 및 공고명</div>
            <div className="col-span-2">지역</div>
            <div className="col-span-2">근무 조건</div>
            <div className="col-span-2 text-right">급여 및 마감</div>
            <div className="col-span-1 text-right">상태</div>
          </div>

          {jobs.map((job) => {
            const businessType = job.businessType?.[0];
            const workTime = job.workTime?.[0];
            const workDays = job.workDays?.slice(0, 2)?.map((value) => OPTION_LABEL_MAP.workDays[value] ?? value).join(', ');

            return (
              <Link
                key={job.recruitId}
                to="/recruit-detail"
                className="grid grid-cols-1 gap-4 border-b border-[#e8e8e8] px-6 py-6 transition-colors hover:bg-[#f9f9f9] lg:grid-cols-12 lg:items-center"
              >
                <div className="col-span-1 lg:col-span-5">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-bold text-primary">추천 공고 #{job.recruitId}</p>
                    {job.urgent ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-1 text-[10px] font-black text-primary">
                        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                          emergency
                        </span>
                        긴급
                      </span>
                    ) : null}
                  </div>
                  <h4 className="text-base font-bold leading-snug text-on-surface">{job.title}</h4>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-on-surface-variant">
                    <span>{job.status ?? 'OPEN'}</span>
                    {job.workPeriod?.[0] ? (
                      <>
                        <span>•</span>
                        <span>{OPTION_LABEL_MAP.workPeriod[job.workPeriod[0]] ?? job.workPeriod[0]}</span>
                      </>
                    ) : null}
                    {job.headCount ? (
                      <>
                        <span>•</span>
                        <span>{job.headCount}명 모집</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined mr-1 text-sm lg:hidden">location_on</span>
                  {job.sido} {job.sigungu}
                </div>

                <div className="col-span-1 lg:col-span-2 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
                  {businessType ? (
                    <span className="rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[11px] font-bold text-on-surface">
                      {businessTypeLabelMap[businessType] ?? businessType}
                    </span>
                  ) : null}
                  {workTime ? (
                    <span className="rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[11px] font-bold text-on-surface">
                      {OPTION_LABEL_MAP.workTime[workTime] ?? workTime}
                    </span>
                  ) : null}
                  {workDays ? <span className="text-[11px] font-semibold">{workDays}</span> : null}
                </div>

                <div className="col-span-1 text-left lg:col-span-2 lg:text-right">
                  <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-0">
                    <span className="text-lg font-black text-primary">{formatSalary(job.salary, job.salaryType)}</span>
                    <span className="text-[11px] font-bold text-on-surface-variant">{formatDeadline(job.deadline)}</span>
                  </div>
                </div>

                <div className="col-span-1 flex items-center justify-between lg:col-span-1 lg:justify-end">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${job.urgent ? 'bg-primary text-white' : 'bg-[#f3f3f3] text-on-surface-variant'}`}>
                    {job.urgent ? '긴급' : '일반'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
