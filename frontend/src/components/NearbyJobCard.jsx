import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 주변 공고 한 건을 표시하는 카드 컴포넌트.
 * 기존 테이블 행 스타일을 유지하면서 거리(distanceKm)를 추가로 표시합니다.
 *
 * @param {{ job: import('../services/nearbyApi').RecruitNearbyResponseDto }} props
 */
export default function NearbyJobCard({ job }) {
  const {
    recruitId,
    title,
    urgent,
    salary,
    salaryType,
    sido,
    sigungu,
    businessType,
    deadline,
    distanceKm,
  } = job;

  const salaryLabel = salaryType === 'HOURLY' ? '/시간' : salaryType === 'DAILY' ? '/일' : '';
  const formattedSalary = salary?.toLocaleString('ko-KR');
  const formattedDistance =
    distanceKm != null
      ? distanceKm < 1
        ? `${Math.round(distanceKm * 1000)}m`
        : `${distanceKm.toFixed(1)}km`
      : null;

  const locationLabel = [sido, sigungu].filter(Boolean).join(' ');
  const categoryLabel =
    Array.isArray(businessType) && businessType.length > 0
      ? businessType[0]
      : '기타';

  const deadlineDiff = deadline
    ? Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;
  const deadlineLabel =
    deadlineDiff != null
      ? deadlineDiff <= 0
        ? 'D-0'
        : `D-${deadlineDiff}`
      : null;
  const isUrgentDeadline = deadlineDiff != null && deadlineDiff <= 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-6 border-b border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors items-center relative">
      {/* 기업 및 공고명 */}
      <div className="col-span-1 lg:col-span-4">
        <h4 className="text-base font-bold flex items-center gap-1.5">
          {urgent && (
            <span
              className="material-symbols-outlined text-primary text-[16px]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              notifications_active
            </span>
          )}
          {title}
        </h4>
      </div>

      {/* 지역 */}
      <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
        <span className="material-symbols-outlined text-sm mr-1 lg:hidden">location_on</span>
        {locationLabel || '-'}
      </div>

      {/* 거리 */}
      <div className="col-span-1 lg:col-span-2 flex items-center gap-1 text-sm font-semibold text-primary">
        <span className="material-symbols-outlined text-sm">near_me</span>
        {formattedDistance ? `내 위치에서 ${formattedDistance}` : '-'}
      </div>

      {/* 카테고리 */}
      <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
        <span className="material-symbols-outlined text-sm mr-1 lg:hidden">category</span>
        {categoryLabel}
      </div>

      {/* 급여 및 마감 */}
      <div className="col-span-1 lg:col-span-2 text-left lg:text-right">
        <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-0">
          <span
            className={`text-lg font-black ${urgent || isUrgentDeadline ? 'text-primary' : 'text-on-surface'}`}
          >
            {formattedSalary}원
            {salaryLabel && (
              <small className="text-[10px] font-bold text-on-surface-variant ml-1">
                {salaryLabel}
              </small>
            )}
          </span>
          {deadlineLabel && (
            <span
              className={`text-[11px] font-bold ${isUrgentDeadline ? 'text-primary' : 'text-stone-400'}`}
            >
              {deadlineLabel}
            </span>
          )}
        </div>
      </div>

      {/* 전체 클릭 영역 */}
      <Link
        to={`/recruit-detail?recruitId=${recruitId}`}
        className="absolute inset-0 z-10"
        aria-label={`${title} 공고 상세보기`}
      />
    </div>
  );
}
