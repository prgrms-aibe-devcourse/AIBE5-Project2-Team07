import React from 'react';
import NearbyJobCard from './NearbyJobCard';

/**
 * 주변 공고 섹션 컴포넌트.
 * loading / error / 빈 결과 / 결과 목록 상태를 처리합니다.
 *
 * @param {{
 *   jobs: Array,
 *   loading: boolean,
 *   error: string|null,
 *   selectedDistance: string
 * }} props
 */
export default function NearbyJobsSection({ jobs, loading, error, selectedDistance }) {
  return (
    <div>
      {/* 테이블 헤더 (주변 공고용 - 거리 컬럼 추가) */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#e8e8e8] text-on-surface-variant text-xs font-bold uppercase tracking-wider">
        <div className="col-span-4">기업 및 공고명</div>
        <div className="col-span-2">지역</div>
        <div className="col-span-2">거리</div>
        <div className="col-span-2">카테고리</div>
        <div className="col-span-2 text-right">급여 및 마감</div>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-on-surface-variant">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-medium">
            내 위치 기준 {selectedDistance} 이내 공고를 검색 중입니다…
          </p>
        </div>
      )}

      {/* 에러 상태 */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <span className="material-symbols-outlined text-5xl text-red-400">location_off</span>
          <p className="text-base font-bold text-on-surface">{error}</p>
          <p className="text-sm text-on-surface-variant">
            브라우저 주소 표시줄 왼쪽의 🔒 아이콘을 눌러 위치 권한을 허용해 주세요.
          </p>
        </div>
      )}

      {/* 결과 없음 */}
      {!loading && !error && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">
            location_searching
          </span>
          <p className="text-base font-bold text-on-surface">
            {selectedDistance} 이내에 공고가 없습니다.
          </p>
          <p className="text-sm text-on-surface-variant">거리를 넓혀서 다시 검색해 보세요.</p>
        </div>
      )}

      {/* 공고 목록 */}
      {!loading && !error && jobs.length > 0 && (
        <>
          {jobs.map((job) => (
            <NearbyJobCard key={job.recruitId} job={job} />
          ))}
          <p className="text-center text-xs text-on-surface-variant py-4">
            총 {jobs.length}개의 공고를 찾았습니다.
          </p>
        </>
      )}
    </div>
  );
}
