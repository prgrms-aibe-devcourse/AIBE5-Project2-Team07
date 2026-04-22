import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

const API_PREFIXES = ['/api', ''];

const PERIOD_OPTIONS = [
  { value: 'OneDay', label: '하루' },
  { value: 'OneWeek', label: '1주 이하' },
  { value: 'OneMonth', label: '1개월 이하' },
  { value: 'ThreeMonths', label: '3개월 이하' },
  { value: 'SixMonths', label: '6개월 이하' },
  { value: 'OneYear', label: '1년 이하' },
  { value: 'MoreThanOneYear', label: '1년 이상' }
];

const TIME_OPTIONS = [
  { value: 'MORNING', label: '오전' },
  { value: 'AFTERNOON', label: '오후' },
  { value: 'EVENING', label: '저녁' },
  { value: 'NIGHT', label: '새벽' },
  { value: 'MORNING_AFTERNOON', label: '오전~오후' },
  { value: 'AFTERNOON_EVENING', label: '오후~저녁' },
  { value: 'EVENING_NIGHT', label: '저녁~새벽' },
  { value: 'NIGHT_MORNING', label: '새벽~오전' },
  { value: 'FULLTIME', label: '풀타임' }
];

const DAY_OPTIONS = [
  { value: 'MON', label: '월' },
  { value: 'TUE', label: '화' },
  { value: 'WED', label: '수' },
  { value: 'THU', label: '목' },
  { value: 'FRI', label: '금' },
  { value: 'SAT', label: '토' },
  { value: 'SUN', label: '일' }
];

const BUSINESS_OPTIONS = [
  { value: 'FOOD_RESTAURANT', label: '외식' },
  { value: 'CAFE', label: '카페' },
  { value: 'RETAIL_STORE', label: '매장관리/판매' },
  { value: 'SERVICE', label: '서비스' },
  { value: 'DELIVERY_DRIVER', label: '운전/배달' },
  { value: 'MANUAL_LABOR', label: '현장단순노무' }
];

function normalizeRegion(item) {
  const id = item?.id ?? item?.regionId ?? item?.value;
  const fullName = item?.fullName ?? item?.label ?? item?.regionName ?? '';
  const rawSido = item?.sido ?? '';
  const rawSigungu = item?.sigungu ?? '';

  if (id == null || !fullName) {
    return null;
  }

  if (rawSido && rawSigungu) {
    return {
      value: String(id),
      label: fullName,
      sido: rawSido,
      sigungu: rawSigungu
    };
  }

  const chunks = fullName.split(' ').filter(Boolean);
  const sido = chunks[0] || '기타';
  const sigungu = chunks.slice(1).join(' ') || fullName;
  return {
    value: String(id),
    label: fullName,
    sido,
    sigungu
  };
}

function pickRegionArray(payload) {
  if (Array.isArray(payload)) {
	return payload;
  }
  if (Array.isArray(payload?.regions)) {
	return payload.regions;
  }
  if (Array.isArray(payload?.content)) {
	return payload.content;
  }
  if (Array.isArray(payload?.data)) {
	return payload.data;
  }
  return [];
}

function normalizeRecruitStatus(status) {
  return String(status || '').toUpperCase();
}

function isOpenRecruit(status) {
  return normalizeRecruitStatus(status) === 'OPEN';
}

function isExpiredRecruit(status) {
  return normalizeRecruitStatus(status) === 'EXPIRED';
}

const SORT_OPTIONS = [
  { value: 'LATEST', label: '등록순' },
  { value: 'DEADLINE', label: '마감빠른순' }
];

async function fetchJsonWithFallback(path) {
  let lastError = null;

  for (const prefix of API_PREFIXES) {
	try {
	  const response = await fetch(`${prefix}${path}`);
	  if (response.ok) {
		return response.json();
	  }
	  if (response.status === 404) {
		continue;
	  }
	  const errorText = await response.text();
	  throw new Error(errorText || `요청 실패 (${response.status})`);
	} catch (error) {
	  lastError = error;
	}
  }

  throw lastError || new Error('목록 조회에 실패했습니다.');
}

function formatSalaryAmount(salary) {
  if (salary == null) {
	return '-';
  }
  return `${Number(salary).toLocaleString('ko-KR')}원`;
}

function getSalaryTypeMeta(salaryType) {
  if (salaryType === 'MONTHLY') {
	return {
	  label: '월급',
	  className: 'bg-rose-500 text-rose-100 border border-rose-100'
	};
  }
  return {
	label: '시급',
	className: 'bg-rose-100 text-rose-500 border border-rose-200'
  };
}

function enumListToLabel(values, options) {
  if (!Array.isArray(values) || values.length === 0) {
	return '-';
  }

  const map = options.reduce((acc, option) => {
	acc[option.value] = option.label;
	return acc;
  }, {});

  return values.map((value) => map[value] || value).join(', ');
}

function formatDate(dateText) {
  if (!dateText) {
	return '-';
  }
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
	return dateText;
  }
  return date.toLocaleDateString('ko-KR');
}

export default function RecruitInformationPage() {
  const [tabType, setTabType] = useState('ALL');
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('LATEST');
  const [page, setPage] = useState(1);
  const [openPanel, setOpenPanel] = useState(null);
  const [selectedSido, setSelectedSido] = useState('');
  const [filters, setFilters] = useState({
	isUrgent: false,
	regionIds: [],
	workPeriod: [],
	workTime: [],
	workDays: [],
	businessType: []
  });

  const [recruitPage, setRecruitPage] = useState({
	content: [],
	totalPages: 1,
	totalElements: 0
  });
  const [regions, setRegions] = useState([]);
  const [regionMap, setRegionMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const size = 20;

  const regionOptions = useMemo(() => {
	if (regions.length > 0) {
	  return regions;
	}

	return Object.entries(regionMap)
	  .map(([id, name]) => normalizeRegion({ id, fullName: name }))
	  .filter(Boolean)
	  .sort((a, b) => a.label.localeCompare(b.label, 'ko'));
  }, [regions, regionMap]);

  const parsedRegionOptions = useMemo(() => {
	return regionOptions.map((region) => {
	  const chunks = region.label.split(' ').filter(Boolean);
	  const sido = chunks[0] || '기타';
	  const sigungu = chunks.slice(1).join(' ') || region.label;
	  return {
		...region,
		sido,
		sigungu
	  };
	});
  }, [regionOptions]);

  const sidoOptions = useMemo(() => {
	return [...new Set(parsedRegionOptions.map((region) => region.sido))].sort((a, b) => a.localeCompare(b, 'ko'));
  }, [parsedRegionOptions]);

  const districtOptions = useMemo(() => {
	if (!selectedSido) {
	  return [];
	}
	return parsedRegionOptions.filter((region) => region.sido === selectedSido);
  }, [parsedRegionOptions, selectedSido]);

  const selectedBadges = useMemo(() => {
	const periodMap = PERIOD_OPTIONS.reduce((acc, option) => ({ ...acc, [option.value]: option.label }), {});
	const dayMap = DAY_OPTIONS.reduce((acc, option) => ({ ...acc, [option.value]: option.label }), {});
	const timeMap = TIME_OPTIONS.reduce((acc, option) => ({ ...acc, [option.value]: option.label }), {});
	const businessMap = BUSINESS_OPTIONS.reduce((acc, option) => ({ ...acc, [option.value]: option.label }), {});
	const regionLabelMap = regionOptions.reduce((acc, region) => ({ ...acc, [region.value]: region.label }), {});

	const badges = [];
	if (filters.isUrgent) {
	  badges.push({ key: 'isUrgent', value: 'true', label: '긴급 공고' });
	}
	filters.regionIds.forEach((id) => {
	  badges.push({ key: 'regionIds', value: id, label: regionLabelMap[id] || regionMap[id] || `지역 ${id}` });
	});
	filters.workPeriod.forEach((value) => {
	  badges.push({ key: 'workPeriod', value, label: `근무기간 ${periodMap[value] || value}` });
	});
	filters.workDays.forEach((value) => {
	  badges.push({ key: 'workDays', value, label: `근무요일 ${dayMap[value] || value}` });
	});
	filters.workTime.forEach((value) => {
	  badges.push({ key: 'workTime', value, label: `근무시간 ${timeMap[value] || value}` });
	});
	filters.businessType.forEach((value) => {
	  badges.push({ key: 'businessType', value, label: `업종 ${businessMap[value] || value}` });
	});

	return badges;
  }, [filters, regionMap, regionOptions]);

  const pageNumbers = useMemo(() => {
	const total = Math.max(recruitPage.totalPages || 1, 1);
	const start = Math.max(1, page - 2);
	const end = Math.min(total, start + 4);
	const numbers = [];
	for (let current = start; current <= end; current += 1) {
	  numbers.push(current);
	}
	return numbers;
  }, [page, recruitPage.totalPages]);

  useEffect(() => {
	if (!selectedSido && sidoOptions.length > 0) {
	  setSelectedSido(sidoOptions[0]);
	}
  }, [selectedSido, sidoOptions]);

  useEffect(() => {
	const fetchRegions = async () => {
	  try {
		const firstResult = await fetchJsonWithFallback('/regions?page=1&size=1000');
		let regionArray = pickRegionArray(firstResult);

		if (Array.isArray(firstResult?.content) && Number(firstResult?.totalPages) > 1) {
		  const pageCount = Number(firstResult.totalPages);
		  const extraPages = [];
		  for (let current = 2; current <= pageCount; current += 1) {
			extraPages.push(fetchJsonWithFallback(`/regions?page=${current}&size=1000`));
		  }
		  const extraResults = await Promise.all(extraPages);
		  extraResults.forEach((pageResult) => {
			regionArray = [...regionArray, ...pickRegionArray(pageResult)];
		  });
		}

		const normalized = regionArray
		  .map((item) => normalizeRegion(item))
		  .filter(Boolean)
		  .sort((a, b) => a.label.localeCompare(b.label, 'ko'));
		if (normalized.length > 0) {
		  setRegions(normalized);
		}
	  } catch (fetchRegionError) {
		// 지역 API 실패 시 목록 응답에서 모은 regionMap 데이터로 fallback
	  }
	};

	fetchRegions();
  }, []);

  useEffect(() => {
	const fetchRecruitList = async () => {
	  setLoading(true);
	  setError('');

	  try {
		const params = new URLSearchParams();
		params.set('type', tabType);
		params.set('page', String(page));
		params.set('size', String(size));
		params.set('sort', sort);

		if (keyword.trim()) {
		  params.set('keyword', keyword.trim());
		}
		if (filters.isUrgent) {
		  // 백엔드에서 파라미터명이 다양할 수 있어서 여러 키를 함께 보냅니다.
		  // (일부 API는 `urgent`, `isUrgent`, `is_urgent` 중 하나를 기대할 수 있음)
		  params.set('isUrgent', 'true');
		  params.set('urgent', 'true');
		  params.set('is_urgent', 'true');
		}
		filters.regionIds.forEach((regionId) => params.append('regionId', regionId));
		filters.workPeriod.forEach((value) => params.append('workPeriod', value));
		filters.workTime.forEach((value) => params.append('workTime', value));
		filters.workDays.forEach((value) => params.append('workDays', value));
		filters.businessType.forEach((value) => params.append('businessType', value));

		const result = await fetchJsonWithFallback(`/recruits?${params.toString()}`);
		const rawContent = Array.isArray(result.content) ? result.content : [];
		const content = rawContent.filter((item) => !isExpiredRecruit(item?.status));
		setRecruitPage({
		  content,
		  totalPages: Math.max(result.totalPages || 1, 1),
		  totalElements: result.totalElements ?? content.length
		});

		setRegionMap((prev) => {
		  const next = { ...prev };
		  content.forEach((item) => {
			if (item.regionId != null && item.regionName) {
			  next[String(item.regionId)] = item.regionName;
			}
		  });
		  return next;
		});
	  } catch (fetchError) {
		setError(fetchError.message || '공고 목록을 불러오지 못했습니다.');
	  } finally {
		setLoading(false);
	  }
	};

	fetchRecruitList();
  }, [tabType, keyword, sort, page, filters]);

  const handleSearchSubmit = () => {
	setPage(1);
	setKeyword(keywordInput);
  };

  const handleTabChange = (nextType) => {
	setTabType(nextType);
	setPage(1);
  };

  const toggleMultiFilter = (key, value) => {
	setPage(1);
	setFilters((prev) => {
	  const exists = prev[key].includes(value);
	  return {
		...prev,
		[key]: exists ? prev[key].filter((item) => item !== value) : [...prev[key], value]
	  };
	});
  };

  const removeBadge = (key, value) => {
	setPage(1);
	setFilters((prev) => {
	  if (key === 'isUrgent') {
		return { ...prev, isUrgent: false };
	  }
	  return {
		...prev,
		[key]: prev[key].filter((item) => item !== value)
	  };
	});
  };

  const resetFilters = () => {
	setTabType('ALL');
	setKeyword('');
	setKeywordInput('');
	setSort('LATEST');
	setPage(1);
	setFilters({
	  isUrgent: false,
	  regionIds: [],
	  workPeriod: [],
	  workTime: [],
	  workDays: [],
	  businessType: []
	});
  };

  const filterChipClass = (active) => `px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${active ? 'bg-primary-soft border-primary text-primary' : 'bg-white border-outline text-on-surface hover:border-primary'}`;

  return (
	<>
	  <TopNavBar />
	  <main className="custom-container pt-32 pb-20">
		<section className="mb-10">
		  <div className="flex flex-col gap-5 bg-[#f9f9f9] p-8 rounded-2xl border border-outline">
			<div className="flex flex-col md:flex-row gap-3">
			  <input
				className="w-full h-12 px-4 text-base bg-white border border-outline rounded-lg focus:ring-2 focus:ring-primary"
				placeholder="공고 제목으로 검색"
				type="text"
				value={keywordInput}
				onChange={(event) => setKeywordInput(event.target.value)}
				onKeyDown={(event) => {
				  if (event.key === 'Enter') {
					handleSearchSubmit();
				  }
				}}
			  />
			  <CommonButton onClick={handleSearchSubmit} className="h-12 px-6 shrink-0">
				검색
			  </CommonButton>
			</div>

			<div className="flex flex-wrap items-center gap-2">
			  <CommonButton
				variant="toggle"
				size="sm"
				active={filters.isUrgent}
				onClick={() => {
				  setPage(1);
				  setFilters((prev) => ({ ...prev, isUrgent: !prev.isUrgent }));
				}}
				icon={<span className="material-symbols-outlined text-sm">emergency</span>}
				inactiveClassName="bg-white border border-[#e0e0e0] text-on-surface"
			  >
				긴급 공고
			  </CommonButton>

			  <CommonButton
				variant="toggle"
				size="sm"
				active={openPanel === 'region'}
				onClick={() => setOpenPanel((prev) => (prev === 'region' ? null : 'region'))}
				inactiveClassName="bg-white border border-[#e0e0e0] text-on-surface"
			  >
				지역별
			  </CommonButton>
			  <CommonButton
				variant="toggle"
				size="sm"
				active={openPanel === 'period'}
				onClick={() => setOpenPanel((prev) => (prev === 'period' ? null : 'period'))}
				inactiveClassName="bg-white border border-[#e0e0e0] text-on-surface"
			  >
				기간별
			  </CommonButton>
			  <CommonButton
				variant="toggle"
				size="sm"
				active={openPanel === 'business'}
				onClick={() => setOpenPanel((prev) => (prev === 'business' ? null : 'business'))}
				inactiveClassName="bg-white border border-[#e0e0e0] text-on-surface"
			  >
				업종별
			  </CommonButton>

			  <CommonButton className="ml-1 p-2" variant="toggle" title="초기화" onClick={resetFilters}>
				<span className="material-symbols-outlined">restart_alt</span>
			  </CommonButton>
			</div>

			{openPanel === 'region' && (
			  <div className="bg-white border border-outline rounded-xl p-4">
				<div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
				  <div className="border border-outline rounded-lg p-2 max-h-64 overflow-y-auto">
					{(sidoOptions.length === 0) && <p className="text-sm text-on-surface-variant p-2">지역 데이터가 없습니다.</p>}
					{sidoOptions.map((sido) => (
					  <button
						key={sido}
						type="button"
						className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedSido === sido ? 'bg-primary-soft text-primary font-semibold' : 'hover:bg-[#f6f6f6]'}`}
						onClick={() => setSelectedSido(sido)}
					  >
						{sido}
					  </button>
					))}
				  </div>
				  <div className="border border-outline rounded-lg p-3 min-h-64">
					<p className="text-xs text-on-surface-variant mb-3">시/군/구 선택 (다중 선택)</p>
					<div className="flex flex-wrap gap-2">
					  {districtOptions.map((region) => (
						<button
						  key={region.value}
						  type="button"
						  className={filterChipClass(filters.regionIds.includes(region.value))}
						  onClick={() => toggleMultiFilter('regionIds', region.value)}
						>
						  {region.sigungu}
						</button>
					  ))}
					</div>
				  </div>
				</div>
			  </div>
			)}

			{openPanel === 'period' && (
			  <div className="bg-white border border-outline rounded-xl p-4 space-y-4">
				<div>
				  <p className="text-sm font-semibold mb-2">근무기간</p>
				  <div className="flex flex-wrap gap-2">
					{PERIOD_OPTIONS.map((option) => (
					  <button key={option.value} type="button" className={filterChipClass(filters.workPeriod.includes(option.value))} onClick={() => toggleMultiFilter('workPeriod', option.value)}>
						{option.label}
					  </button>
					))}
				  </div>
				</div>
				<div>
				  <p className="text-sm font-semibold mb-2">근무요일</p>
				  <div className="flex flex-wrap gap-2">
					{DAY_OPTIONS.map((option) => (
					  <button key={option.value} type="button" className={filterChipClass(filters.workDays.includes(option.value))} onClick={() => toggleMultiFilter('workDays', option.value)}>
						{option.label}
					  </button>
					))}
				  </div>
				</div>
				<div>
				  <p className="text-sm font-semibold mb-2">근무시간</p>
				  <div className="flex flex-wrap gap-2">
					{TIME_OPTIONS.map((option) => (
					  <button key={option.value} type="button" className={filterChipClass(filters.workTime.includes(option.value))} onClick={() => toggleMultiFilter('workTime', option.value)}>
						{option.label}
					  </button>
					))}
				  </div>
				</div>
			  </div>
			)}

			{openPanel === 'business' && (
			  <div className="bg-white border border-outline rounded-xl p-4">
				<p className="text-sm font-semibold mb-3">업종 선택 (다중 선택)</p>
				<div className="flex flex-wrap gap-2">
				  {BUSINESS_OPTIONS.map((option) => (
					<button key={option.value} type="button" className={filterChipClass(filters.businessType.includes(option.value))} onClick={() => toggleMultiFilter('businessType', option.value)}>
					  {option.label}
					</button>
				  ))}
				</div>
			  </div>
			)}

			{selectedBadges.length > 0 && (
			  <div className="flex flex-wrap gap-2 border-t border-outline pt-3">
				{selectedBadges.map((badge) => (
				  <button key={`${badge.key}-${badge.value}`} type="button" className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-soft text-primary" onClick={() => removeBadge(badge.key, badge.value)}>
					<span>{badge.label}</span>
					<span className="material-symbols-outlined text-sm">close</span>
				  </button>
				))}
			  </div>
			)}
		  </div>
		</section>

		<nav className="mb-8 border-b border-outline">
		  <div className="flex gap-8">
			{[
			  { type: 'ALL', label: '전체' },
			  { type: 'SHORT', label: '단기' },
			  { type: 'LONG', label: '중장기' }
			].map((tab) => (
			  <button
				key={tab.type}
				className={`pb-4 text-lg relative -bottom-[1px] ${tabType === tab.type ? 'font-bold text-primary border-b-2 border-primary' : 'font-medium text-on-surface-variant hover:text-primary'}`}
				onClick={() => handleTabChange(tab.type)}
			  >
				{tab.label}
			  </button>
			))}
		  </div>
		</nav>

		<section>
		  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
			<h2 className="text-2xl font-extrabold tracking-tighter">공고 리스트</h2>
			<div className="flex items-center gap-4 text-sm font-medium">
			  {SORT_OPTIONS.map((option) => (
				<button
				  key={option.value}
				  className={sort === option.value ? 'text-on-surface font-bold' : 'text-on-surface-variant hover:text-primary'}
				  onClick={() => {
					setPage(1);
					setSort(option.value);
				  }}
				>
				  {option.label}
				</button>
			  ))}
			</div>
		  </div>

		  {loading && <p className="py-8 text-on-surface-variant">공고를 불러오는 중입니다...</p>}
		  {!loading && error && <p className="py-8 text-red-600">{error}</p>}

		  {!loading && !error && (
			<>
			  <div className="text-sm text-on-surface-variant mb-3">총 {recruitPage.totalElements.toLocaleString('ko-KR')}건</div>
			  <div className="flex flex-col bg-white border border-outline rounded-xl overflow-hidden shadow-sm">
				<div className="hidden md:grid grid-cols-[20px_minmax(240px,1fr)_140px_170px_110px_100px_90px_90px] gap-3 px-5 py-4 bg-[#f9f9f9] border-b border-outline text-xs font-bold text-on-surface-variant uppercase tracking-wider">
				  <div className="text-center">*</div>
				  <div>기업 및 공고정보</div>
				  <div className="text-center">근무지</div>
				  <div className="text-center">급여정보</div>
				  <div className="text-center">근무기간</div>
				  <div className="text-center">근무시간</div>
				  <div className="text-center">마감일</div>
				  <div className="text-center">등록일</div>
				</div>

				{recruitPage.content.map((item) => (
				  (() => {
					const isUrgent = Boolean(item.isUrgent ?? item.urgent);
					const isOpenStatus = isOpenRecruit(item.status);
					const salaryTypeMeta = getSalaryTypeMeta(item.salaryType);
					return (
				  <div
					key={item.id}
					className={`grid grid-cols-1 md:grid-cols-[20px_minmax(240px,1fr)_140px_170px_110px_100px_90px_90px] gap-3 px-5 py-5 items-center border-b border-outline cursor-pointer transition-colors relative ${isOpenStatus ? 'hover:bg-[#f9f9f9]' : 'bg-gray-50 text-on-surface-variant'}`}
				  >
					<div className="hidden md:flex justify-center">
					  {isUrgent && (
						<span className="text-primary material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
						  emergency
						</span>
					  )}
					</div>
					<div className="flex items-center gap-3 min-w-0">
					  <div className="flex flex-col gap-0.5 min-w-0">
						<span className="text-xs font-bold text-on-surface-variant truncate" title={item.companyName || '-'}>{item.companyName || '-'}</span>
						<div className="flex items-center gap-1.5 min-w-0">
						  {!isOpenStatus && <span className="inline-flex shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">마감</span>}
						  <h4 className={`text-[15px] font-medium truncate ${!isOpenStatus ? 'text-on-surface-variant' : isUrgent ? 'text-primary' : 'text-on-surface'}`} title={item.title || '-'}>{item.title || '-'}</h4>
						</div>
					  </div>
					</div>
					<div className="text-sm text-center truncate" title={item.regionName || '-'}>{item.regionName || '-'}</div>
					<div className="min-w-0 text-center">
					  <div className="inline-flex items-center gap-1.5 max-w-full">
						<span className="text-sm font-semibold text-on-surface truncate">{formatSalaryAmount(item.salary)}</span>
						<span className={`inline-flex shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold ${salaryTypeMeta.className}`}>
						  {salaryTypeMeta.label}
						</span>
					  </div>
					</div>
					<div className="text-sm text-center truncate" title={enumListToLabel(item.workPeriod, PERIOD_OPTIONS)}>{enumListToLabel(item.workPeriod, PERIOD_OPTIONS)}</div>
					<div className="text-sm text-center truncate" title={enumListToLabel(item.workTime, TIME_OPTIONS)}>{enumListToLabel(item.workTime, TIME_OPTIONS)}</div>
					<div className="text-xs text-on-surface-variant text-center">{formatDate(item.deadline)}</div>
					<div className="text-xs text-on-surface-variant text-center">{formatDate(item.createdAt)}</div>
					<Link to={`/recruit-detail?recruitId=${item.id}`} className="absolute inset-0 z-10" />
				  </div>
					);
				  })()
				))}

				{recruitPage.content.length === 0 && (
				  <div className="px-8 py-16 text-center text-on-surface-variant">조건에 맞는 공고가 없습니다.</div>
				)}
			  </div>

			  <div className="flex justify-center items-center gap-2 mt-10">
				<button
				  className="w-10 h-10 rounded-lg border border-outline disabled:opacity-40"
				  disabled={page <= 1}
				  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
				>
				  <span className="material-symbols-outlined">chevron_left</span>
				</button>

				{pageNumbers.map((number) => (
				  <button
					key={number}
					className={`w-10 h-10 rounded-lg border ${number === page ? 'bg-primary text-white border-primary' : 'border-outline'}`}
					onClick={() => setPage(number)}
				  >
					{number}
				  </button>
				))}

				<button
				  className="w-10 h-10 rounded-lg border border-outline disabled:opacity-40"
				  disabled={page >= (recruitPage.totalPages || 1)}
				  onClick={() => setPage((prev) => Math.min(recruitPage.totalPages || 1, prev + 1))}
				>
				  <span className="material-symbols-outlined">chevron_right</span>
				</button>
			  </div>
			</>
		  )}
		</section>
	  </main>
	  <AppFooter />
	  <MobileBottomNav />
	</>
  );
}

