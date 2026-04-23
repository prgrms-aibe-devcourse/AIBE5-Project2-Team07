import React, { useEffect, useMemo, useState } from 'react';
import CommonButton from './CommonButton';
import { fetchRegions } from '../services/regionApi';
import {
  BUSINESS_TYPE_OPTIONS,
  OPTION_LABEL_MAP,
  RECOMMEND_DEFAULT_FILTERS,
  RECOMMEND_RESULT_COUNT_MAX,
  RECOMMEND_RESULT_COUNT_MIN,
  SALARY_TYPE_OPTIONS,
  WORK_DAY_OPTIONS,
  WORK_PERIOD_OPTIONS,
  WORK_TIME_OPTIONS,
} from '../constants/recommendFilterOptions';

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-[#ece7e5] bg-white p-5 md:p-6 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <div>
          <h3 className="text-base font-extrabold text-on-surface">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function ChipButton({ active, children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full border px-4 py-2 text-sm font-bold transition-all',
        active
          ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
          : 'border-outline bg-white text-on-surface-variant hover:border-primary/30 hover:bg-primary-soft hover:text-primary',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function RegionPicker({
  regions,
  loading,
  error,
  selectedRegionId,
  onSelectRegion,
}) {
  const groupedRegions = useMemo(() => {
    const map = new Map();

    regions.forEach((region) => {
      if (!map.has(region.sido)) {
        map.set(region.sido, []);
      }
      map.get(region.sido).push(region);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b, 'ko'))
      .map(([sido, regionList]) => ({
        sido,
        regions: regionList.sort((a, b) => a.sigungu.localeCompare(b.sigungu, 'ko')),
      }));
  }, [regions]);

  const selectedRegion = useMemo(
    () => regions.find((region) => region.id === selectedRegionId) ?? null,
    [regions, selectedRegionId],
  );

  const [selectedSido, setSelectedSido] = useState(selectedRegion?.sido ?? null);

  const activeSido = selectedRegion?.sido ?? selectedSido ?? groupedRegions[0]?.sido ?? null;

  const currentSigunguList = groupedRegions.find((group) => group.sido === activeSido)?.regions ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-primary/30 bg-primary-soft px-4 py-3">
        <span className="material-symbols-outlined text-primary">location_on</span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/80">선택된 지역</p>
          <p className="truncate text-sm font-bold text-on-surface">
            {selectedRegion ? `${selectedRegion.sido} ${selectedRegion.sigungu}` : '선택 안함'}
          </p>
        </div>
        <ChipButton active={!selectedRegionId} onClick={() => onSelectRegion(null)}>
          선택 안함
        </ChipButton>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-outline bg-[#fafafa] px-4 py-8 text-center text-sm font-medium text-on-surface-variant">
          지역 목록을 불러오는 중입니다.
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="max-h-72 overflow-y-auto rounded-2xl border border-outline bg-[#fafafa] p-2">
            {groupedRegions.map((group) => (
              <button
                key={group.sido}
                type="button"
                onClick={() => setSelectedSido(group.sido)}
                className={[
                  'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors',
                  activeSido === group.sido
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-white hover:text-on-surface',
                ].join(' ')}
              >
                <span>{group.sido}</span>
                <span className="text-xs font-semibold text-on-surface-variant">{group.regions.length}</span>
              </button>
            ))}
          </div>

          <div className="max-h-72 overflow-y-auto rounded-2xl border border-outline bg-white p-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {currentSigunguList.map((region) => {
                const isActive = selectedRegionId === region.id;
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => onSelectRegion(region.id)}
                    className={[
                      'rounded-xl border px-4 py-3 text-left text-sm font-bold transition-all',
                      isActive
                        ? 'border-primary bg-primary-soft text-primary shadow-sm'
                        : 'border-outline text-on-surface-variant hover:border-primary/30 hover:bg-primary-soft hover:text-on-surface',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{region.sigungu}</span>
                      {isActive ? (
                        <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs font-medium text-on-surface-variant">{region.fullName ?? `${region.sido} ${region.sigungu}`}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MultiSelectGroup({ options, selectedValues, onToggle, columnsClassName = 'grid-cols-2 md:grid-cols-3' }) {
  return (
    <div className={`grid gap-3 ${columnsClassName}`}>
      {options.map((option) => {
        const isActive = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onToggle(option.value)}
            className={[
              'rounded-2xl border px-4 py-3 text-left transition-all',
              isActive
                ? 'border-primary bg-primary-soft shadow-sm'
                : 'border-outline bg-white hover:border-primary/30 hover:bg-[#fcfbfb]',
            ].join(' ')}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-on-surface'}`}>{option.label}</span>
              <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-primary' : 'text-outline'}`}>
                {isActive ? 'check_circle' : 'add_circle'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function RecommendFilterModal({
  isOpen,
  initialFilters = RECOMMEND_DEFAULT_FILTERS,
  onClose,
  onApply,
}) {
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [regions, setRegions] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [regionsError, setRegionsError] = useState('');
  const [hasFetchedRegions, setHasFetchedRegions] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    setDraftFilters(initialFilters);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [initialFilters, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || hasFetchedRegions) {
      return;
    }

    let isMounted = true;

    async function loadRegions() {
      try {
        setRegionsLoading(true);
        setRegionsError('');
        const response = await fetchRegions();
        if (!isMounted) return;
        setRegions(Array.isArray(response) ? response : []);
        setHasFetchedRegions(true);
      } catch (error) {
        if (!isMounted) return;
        setRegionsError(error.message || '지역 목록을 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setRegionsLoading(false);
        }
      }
    }

    loadRegions();

    return () => {
      isMounted = false;
    };
  }, [hasFetchedRegions, isOpen]);

  const selectedRegion = useMemo(
    () => regions.find((region) => region.id === draftFilters.regionId) ?? null,
    [draftFilters.regionId, regions],
  );

  const summaryBadges = useMemo(() => {
    const badges = [];

    if (selectedRegion) {
      badges.push(`${selectedRegion.sido} ${selectedRegion.sigungu}`);
    }

    if (draftFilters.salaryType) {
      badges.push(OPTION_LABEL_MAP.salaryType[draftFilters.salaryType]);
    }

    if (draftFilters.urgent) {
      badges.push('긴급 공고');
    }

    if (draftFilters.workPeriod.length > 0) {
      badges.push(...draftFilters.workPeriod.map((value) => OPTION_LABEL_MAP.workPeriod[value]));
    }

    if (draftFilters.workDays.length > 0) {
      badges.push(...draftFilters.workDays.map((value) => OPTION_LABEL_MAP.workDays[value]));
    }

    if (draftFilters.businessType.length > 0) {
      badges.push(...draftFilters.businessType.map((value) => OPTION_LABEL_MAP.businessType[value]));
    }

    if (draftFilters.workTime.length > 0) {
      badges.push(...draftFilters.workTime.map((value) => OPTION_LABEL_MAP.workTime[value]));
    }

    return badges;
  }, [draftFilters, selectedRegion]);

  function updateMultiSelect(field, value) {
    setDraftFilters((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  }

  function handleResultCountChange(value) {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      setDraftFilters((prev) => ({ ...prev, resultCount: RECOMMEND_RESULT_COUNT_MIN }));
      return;
    }

    const clamped = Math.min(
      RECOMMEND_RESULT_COUNT_MAX,
      Math.max(RECOMMEND_RESULT_COUNT_MIN, numericValue),
    );

    setDraftFilters((prev) => ({ ...prev, resultCount: clamped }));
  }

  function handleReset() {
    setDraftFilters(RECOMMEND_DEFAULT_FILTERS);
  }

  function handleApply() {
    const requestPayload = {
      ...draftFilters,
      regionId: draftFilters.regionId ?? null,
      salaryType: draftFilters.salaryType ?? null,
      resultCount: Math.min(
        RECOMMEND_RESULT_COUNT_MAX,
        Math.max(RECOMMEND_RESULT_COUNT_MIN, Number(draftFilters.resultCount) || 20),
      ),
    };

    onApply({
      ...requestPayload,
      regionName: selectedRegion ? `${selectedRegion.sido} ${selectedRegion.sigungu}` : '',
    });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[2px]" onMouseDown={onClose}>
      <div
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-[#f8f5f3] shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="border-b border-black/5 bg-white/80 px-5 py-4 backdrop-blur-sm md:px-8 md:py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-black text-primary">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                맞춤형 추천 설정
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">원하는 조건만 골라서 추천받기</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                지역은 선택하지 않아도 되고, 근무기간·요일·시간대·업종·급여조건을 자유롭게 조합할 수 있어요.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-outline bg-white text-on-surface-variant transition-colors hover:text-on-surface"
              aria-label="추천 필터 모달 닫기"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-h-0 overflow-y-auto px-5 py-5 md:px-8 md:py-6">
            <div className="space-y-5">
              <SectionCard icon="location_on" title="지역 선택" subtitle="시/도와 시·군·구를 단계적으로 선택할 수 있어요. 필요 없으면 선택 안함으로 두세요.">
                <RegionPicker
                  regions={regions}
                  loading={regionsLoading}
                  error={regionsError}
                  selectedRegionId={draftFilters.regionId}
                  onSelectRegion={(regionId) => setDraftFilters((prev) => ({ ...prev, regionId }))}
                />
              </SectionCard>

              <SectionCard icon="calendar_month" title="근무 기간" subtitle="복수 선택 가능">
                <MultiSelectGroup
                  options={WORK_PERIOD_OPTIONS}
                  selectedValues={draftFilters.workPeriod}
                  onToggle={(value) => updateMultiSelect('workPeriod', value)}
                />
              </SectionCard>

              <SectionCard icon="event_available" title="근무 요일" subtitle="가능한 요일을 모두 선택해 주세요.">
                <MultiSelectGroup
                  options={WORK_DAY_OPTIONS}
                  selectedValues={draftFilters.workDays}
                  onToggle={(value) => updateMultiSelect('workDays', value)}
                  columnsClassName="grid-cols-4 md:grid-cols-7"
                />
              </SectionCard>

              <SectionCard icon="schedule" title="근무 시간" subtitle="짧은 시간대부터 풀타임까지 복수 선택 가능">
                <MultiSelectGroup
                  options={WORK_TIME_OPTIONS}
                  selectedValues={draftFilters.workTime}
                  onToggle={(value) => updateMultiSelect('workTime', value)}
                />
              </SectionCard>

              <SectionCard icon="business_center" title="업종 선택" subtitle="백엔드 BusinessTypeName enum 기준으로 구성했습니다.">
                <MultiSelectGroup
                  options={BUSINESS_TYPE_OPTIONS}
                  selectedValues={draftFilters.businessType}
                  onToggle={(value) => updateMultiSelect('businessType', value)}
                />
              </SectionCard>

              <SectionCard icon="payments" title="급여 기준 / 긴급 여부" subtitle="급여 타입은 단일 선택입니다.">
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SALARY_TYPE_OPTIONS.map((option) => {
                      const isActive = draftFilters.salaryType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setDraftFilters((prev) => ({
                              ...prev,
                              salaryType: prev.salaryType === option.value ? null : option.value,
                            }))
                          }
                          className={[
                            'rounded-2xl border px-4 py-4 text-left transition-all',
                            isActive
                              ? 'border-primary bg-primary-soft shadow-sm'
                              : 'border-outline bg-white hover:border-primary/30 hover:bg-[#fcfbfb]',
                          ].join(' ')}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-on-surface'}`}>{option.label}</span>
                            <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-primary' : 'text-outline'}`}>
                              {isActive ? 'radio_button_checked' : 'radio_button_unchecked'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setDraftFilters((prev) => ({ ...prev, urgent: !prev.urgent }))}
                    className={[
                      'flex w-full items-center justify-between rounded-2xl border px-4 py-4 transition-all',
                      draftFilters.urgent
                        ? 'border-primary bg-primary-soft shadow-sm'
                        : 'border-outline bg-white hover:border-primary/30 hover:bg-[#fcfbfb]',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">notifications_active</span>
                      <div className="text-left">
                        <p className="text-sm font-bold text-on-surface">긴급 공고만 우선 보기</p>
                        <p className="text-xs text-on-surface-variant">urgent=true 로 요청됩니다.</p>
                      </div>
                    </div>
                    <span className={`material-symbols-outlined ${draftFilters.urgent ? 'text-primary' : 'text-outline'}`}>
                      {draftFilters.urgent ? 'toggle_on' : 'toggle_off'}
                    </span>
                  </button>
                </div>
              </SectionCard>

              <SectionCard icon="format_list_numbered" title="추천 개수" subtitle={`최대 ${RECOMMEND_RESULT_COUNT_MAX}개까지 설정할 수 있어요.`}>
                <div className="rounded-2xl border border-outline bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-on-surface">결과 개수</p>
                      <p className="mt-1 text-xs text-on-surface-variant">선택하지 않으면 기본값은 20개입니다.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleResultCountChange((draftFilters.resultCount || 20) - 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline bg-white text-on-surface-variant hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <input
                        type="number"
                        min={RECOMMEND_RESULT_COUNT_MIN}
                        max={RECOMMEND_RESULT_COUNT_MAX}
                        value={draftFilters.resultCount}
                        onChange={(event) => handleResultCountChange(event.target.value)}
                        className="h-11 w-24 rounded-xl border border-outline bg-[#fafafa] px-3 text-center text-lg font-black text-primary outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleResultCountChange((draftFilters.resultCount || 20) + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline bg-white text-on-surface-variant hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>

          <aside className="border-t border-black/5 bg-white px-5 py-5 lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0 md:px-8">
            <div className="sticky top-0 space-y-4">
              <div className="rounded-3xl bg-primary p-6 text-white shadow-xl shadow-primary/20">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <span className="material-symbols-outlined text-2xl">tune</span>
                </div>
                <h3 className="text-xl font-black">선택 요약</h3>
                <p className="mt-1 text-sm text-white/70">선택한 조건이 아래에 표시됩니다.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {summaryBadges.length > 0 ? (
                    summaryBadges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold tracking-tight shadow-sm"
                      >
                        {badge}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white/80">
                      전체 조건 대상
                    </span>
                  )}
                </div>

                {summaryBadges.length > 0 && (
                  <div className="mt-5 rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">결과 개수</p>
                    <p className="text-3xl font-black">
                      {Math.min(
                        RECOMMEND_RESULT_COUNT_MAX,
                        Math.max(RECOMMEND_RESULT_COUNT_MIN, Number(draftFilters.resultCount) || 20),
                      )}
                      <span className="ml-1 text-base font-bold text-white/70">개</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <CommonButton
                  variant="outline"
                  size="full"
                  onClick={handleReset}
                  className="justify-center"
                  icon={<span className="material-symbols-outlined text-[18px]">restart_alt</span>}
                  iconPosition="left"
                >
                  초기화
                </CommonButton>
                <CommonButton
                  size="fullLg"
                  onClick={handleApply}
                  className="justify-center"
                  icon={<span className="material-symbols-outlined text-[20px]">auto_awesome</span>}
                  iconPosition="left"
                >
                  추천 적용하기
                </CommonButton>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
