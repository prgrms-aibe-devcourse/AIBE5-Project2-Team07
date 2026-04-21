import React, { useState, useEffect } from 'react';
import BrandModal from '../components/BrandModal';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

/* const brandTabs = ['전체', 'CU', 'GS25', '세븐일레븐', '이마트24', '미니스톱']; */

const urgentJobs = [
  {
    brand: 'CU 강남대로점',
    title: '주말 야간 스태프 모집 (경력자 우대)',
    location: '서울 강남구 역삼동',
    payLabel: '시급',
    pay: '11,000원',
    schedule: '토,일 22:00 ~ 08:00',
    posted: '등록: 10분 전',
    urgent: true,
    icon: 'notifications_active',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwQhu8R3USr7Do0KqdLjxfoFdwpLmZxwdfQj5CYnkQpnQpy5k0spCFEpIQ6mf_F0yXkMDbwkh3CVNtFP1Cn4OzuR7ILlbGFXitLqicgkQ1K40kNlmRayRs36d7s7oBjC4awcCPLwNlbNnlsTxu1WKgtf7lhxFQWQ6pG7keML8AXIFP55pbH8X0NTx8WGPn-0qBE6S4y5z56Kklr2FYlxr1AtFUbHgPeweSkh4GU7iYyate1-adqpEt4P2IcZU13XSWWxaNxBKzsZI',
  },
  {
    brand: 'CU 마포합정점',
    title: '평일 오전 타임 성실하신 분 구합니다',
    location: '서울 마포구 합정동',
    payLabel: '시급',
    pay: '9,860원',
    schedule: '월~금 08:00 ~ 14:00',
    posted: '등록: 1시간 전',
    urgent: false,
    icon: 'bookmark',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa-D0K4h6OCzTjD9pul2MiJF88ceWnXR-sStaqWWOmIH0OdCxMLFsZ-N4bgA3QgGjkcJ4m_f6QVd6OAv9NBDNpN6A1gdgwh8zBx_x_qhocm-qHTcemt3m0y2x4XT_i21JRYahuR_0k4ywkIE7DW37Y_5d2rXdcPxRh4owNYDPb98EU2wTQqgaMQrqZQWvNV5AsGw0WQiZTZyuQ8a1ORL0lIuspNby9vyLGnSXYmM8TYjB3Isvug2UMKjw2LpZmFmoHGRIySICjuLI',
  },
  {
    brand: 'CU 성수베이커리점',
    title: '오늘 야간 땜빵 구함 (경력필수)',
    location: '서울 성동구 성수동',
    payLabel: '일급',
    pay: '120,000원',
    schedule: '금 23:00 ~ 08:00',
    posted: '등록: 방금 전',
    urgent: true,
    icon: 'notifications_active',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo4JWIYDTSW25sLKU8x5RZfkuosk6WYpl_fGerkGXlzyaFTqHpQcKYaqlK2cobQsWMjGyxM_H6RY3GCFDWZ-SxEXghZouunPw6lgixfs-_dP0KqVTyB4SjzLGkiJkPcKoV72ONmzhOHtCSOD9MSR41B3tyKXNtHKUuQf6j5L0D64pcbRjMAjKgZnSxawtBFbjqQrz6M_v4JKl2ePYljuDHoSQZooIS_sewARZaCe_T8vfvEf5ZmzElYDjXhLbdXp9veCAbWkicmc0',
  },
  {
    brand: 'CU 잠실월드점',
    title: '저녁 피크타임 계산/진열 스태프 모집',
    location: '서울 송파구 잠실동',
    payLabel: '시급',
    pay: '10,200원',
    schedule: '월~금 17:00 ~ 23:00',
    posted: '등록: 35분 전',
    urgent: false,
    icon: 'bookmark',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwQhu8R3USr7Do0KqdLjxfoFdwpLmZxwdfQj5CYnkQpnQpy5k0spCFEpIQ6mf_F0yXkMDbwkh3CVNtFP1Cn4OzuR7ILlbGFXitLqicgkQ1K40kNlmRayRs36d7s7oBjC4awcCPLwNlbNnlsTxu1WKgtf7lhxFQWQ6pG7keML8AXIFP55pbH8X0NTx8WGPn-0qBE6S4y5z56Kklr2FYlxr1AtFUbHgPeweSkh4GU7iYyate1-adqpEt4P2IcZU13XSWWxaNxBKzsZI',
  },
  {
    brand: 'CU 홍대입구점',
    title: '주말 심야 근무 가능자 우대 채용',
    location: '서울 마포구 서교동',
    payLabel: '시급',
    pay: '11,500원',
    schedule: '토,일 00:00 ~ 08:00',
    posted: '등록: 5분 전',
    urgent: true,
    icon: 'notifications_active',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa-D0K4h6OCzTjD9pul2MiJF88ceWnXR-sStaqWWOmIH0OdCxMLFsZ-N4bgA3QgGjkcJ4m_f6QVd6OAv9NBDNpN6A1gdgwh8zBx_x_qhocm-qHTcemt3m0y2x4XT_i21JRYahuR_0k4ywkIE7DW37Y_5d2rXdcPxRh4owNYDPb98EU2wTQqgaMQrqZQWvNV5AsGw0WQiZTZyuQ8a1ORL0lIuspNby9vyLGnSXYmM8TYjB3Isvug2UMKjw2LpZmFmoHGRIySICjuLI',
  },
  {
    brand: 'CU 광화문점',
    title: '오전 오픈조 상품 진열 담당',
    location: '서울 종로구 세종로',
    payLabel: '시급',
    pay: '10,030원',
    schedule: '월~금 06:30 ~ 12:30',
    posted: '등록: 2시간 전',
    urgent: false,
    icon: 'bookmark',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo4JWIYDTSW25sLKU8x5RZfkuosk6WYpl_fGerkGXlzyaFTqHpQcKYaqlK2cobQsWMjGyxM_H6RY3GCFDWZ-SxEXghZouunPw6lgixfs-_dP0KqVTyB4SjzLGkiJkPcKoV72ONmzhOHtCSOD9MSR41B3tyKXNtHKUuQf6j5L0D64pcbRjMAjKgZnSxawtBFbjqQrz6M_v4JKl2ePYljuDHoSQZooIS_sewARZaCe_T8vfvEf5ZmzElYDjXhLbdXp9veCAbWkicmc0',
  },
  {
    brand: 'CU 강서공항점',
    title: '공항 인근 새벽 근무자 즉시 채용',
    location: '서울 강서구 공항동',
    payLabel: '시급',
    pay: '12,000원',
    schedule: '월~일 04:00 ~ 10:00',
    posted: '등록: 12분 전',
    urgent: true,
    icon: 'notifications_active',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwQhu8R3USr7Do0KqdLjxfoFdwpLmZxwdfQj5CYnkQpnQpy5k0spCFEpIQ6mf_F0yXkMDbwkh3CVNtFP1Cn4OzuR7ILlbGFXitLqicgkQ1K40kNlmRayRs36d7s7oBjC4awcCPLwNlbNnlsTxu1WKgtf7lhxFQWQ6pG7keML8AXIFP55pbH8X0NTx8WGPn-0qBE6S4y5z56Kklr2FYlxr1AtFUbHgPeweSkh4GU7iYyate1-adqpEt4P2IcZU13XSWWxaNxBKzsZI',
  },
  {
    brand: 'CU 노원중계점',
    title: '평일 오후 파트타이머 모집',
    location: '서울 노원구 중계동',
    payLabel: '시급',
    pay: '9,900원',
    schedule: '월~금 14:00 ~ 20:00',
    posted: '등록: 3시간 전',
    urgent: false,
    icon: 'bookmark',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa-D0K4h6OCzTjD9pul2MiJF88ceWnXR-sStaqWWOmIH0OdCxMLFsZ-N4bgA3QgGjkcJ4m_f6QVd6OAv9NBDNpN6A1gdgwh8zBx_x_qhocm-qHTcemt3m0y2x4XT_i21JRYahuR_0k4ywkIE7DW37Y_5d2rXdcPxRh4owNYDPb98EU2wTQqgaMQrqZQWvNV5AsGw0WQiZTZyuQ8a1ORL0lIuspNby9vyLGnSXYmM8TYjB3Isvug2UMKjw2LpZmFmoHGRIySICjuLI',
  },
  {
    brand: 'CU 성남판교점',
    title: '주중 야간 담당자 긴급 구인',
    location: '경기 성남시 분당구',
    payLabel: '시급',
    pay: '11,200원',
    schedule: '월~금 22:00 ~ 06:00',
    posted: '등록: 20분 전',
    urgent: true,
    icon: 'notifications_active',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo4JWIYDTSW25sLKU8x5RZfkuosk6WYpl_fGerkGXlzyaFTqHpQcKYaqlK2cobQsWMjGyxM_H6RY3GCFDWZ-SxEXghZouunPw6lgixfs-_dP0KqVTyB4SjzLGkiJkPcKoV72ONmzhOHtCSOD9MSR41B3tyKXNtHKUuQf6j5L0D64pcbRjMAjKgZnSxawtBFbjqQrz6M_v4JKl2ePYljuDHoSQZooIS_sewARZaCe_T8vfvEf5ZmzElYDjXhLbdXp9veCAbWkicmc0',
  },
  {
    brand: 'CU 인천송도점',
    title: '주말 오전 계산대/청결 담당',
    location: '인천 연수구 송도동',
    payLabel: '시급',
    pay: '10,100원',
    schedule: '토,일 09:00 ~ 15:00',
    posted: '등록: 1일 전',
    urgent: false,
    icon: 'bookmark',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwQhu8R3USr7Do0KqdLjxfoFdwpLmZxwdfQj5CYnkQpnQpy5k0spCFEpIQ6mf_F0yXkMDbwkh3CVNtFP1Cn4OzuR7ILlbGFXitLqicgkQ1K40kNlmRayRs36d7s7oBjC4awcCPLwNlbNnlsTxu1WKgtf7lhxFQWQ6pG7keML8AXIFP55pbH8X0NTx8WGPn-0qBE6S4y5z56Kklr2FYlxr1AtFUbHgPeweSkh4GU7iYyate1-adqpEt4P2IcZU13XSWWxaNxBKzsZI',
  },
];

export default function BrandRecruitExplorePage() {
  const defaultBrandSummary = {
    name: 'CU',
    description: '전국 16,000여 개의 일상을 함께하는 1등 편의점',
    bannerImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7aahMbscZEcQiq4_6unnUWXiMV0dK7fNcgc0zYKstgQzypeR15zuMUV5zD9MFax5dYsBRxmREqMraNugxDGo2rPPx_7oIyqX6O-o9YEsNUhy1dDLkFcQMYUpwSXDbh_6mYaU_LlNdCTqtkxwXmAhTM-MaGnctweFYy-OVaeiNyara11hxz7M-Scd5WdmAnYfB2eSop48UQAeZ3icuv-Cyr4meo1XJ1wa2W8Ett1DqhGHw1rUYYJgsAW3_8zsQ7gfA7Ka2C_4Yqwo',
    logoImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZj6CXaxLTJvMUS4qDtpyp6HHfa63qY6_CmaKWCpaBy1g08xaKBTSKm5aLfwZFoiUONhdxcxStuPb4XSVLtOl3-tdcg_AiXWeKLOwX6AqPDKCsGCpc83szQ2SuT5_gZ55CS14zv5V7atbvg6mKRvKbwExaQ9kpNpqaUEBTXc6rK0GKO3iTkXf613gYtL8gDbyomXRsI8zD7SArOgP48UEkgG7nOQ4WShSW1KHPBGF3f5Wvh9gIfUQ88pzuYBMh-nw7TpeR8FDQ-q8',
  };
  const [brandSummary, setBrandSummary] = useState(defaultBrandSummary);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // region dropdown / selector state
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isWorkConditionOpen, setIsWorkConditionOpen] = useState(false);
  const [selectedSido, setSelectedSido] = useState('서울특별시');
  const [selectedSigungu, setSelectedSigungu] = useState(null);
  const [, setSelectedDong] = useState(null);
  // store options as [{ id, sido, sigungu }]
  const [sigunguOptions, setSigunguOptions] = useState([]);
  // store selected region id (DB PK) for backend filtering
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  // badge state: keep user-visible selected region separate so changing Sido doesn't clear the badge
  const [badgeSido, setBadgeSido] = useState(null);
  const [badgeSigungu, setBadgeSigungu] = useState(null);
  // work condition: selected work dates (array of 'YYYY-MM-DD')
  const [workDates, setWorkDates] = useState([]);
  const [tempDate, setTempDate] = useState('');
  // 근무타입 필터(state) - 오전/오후/저녁 등 토글 버튼
  const [shiftFilters, setShiftFilters] = useState([]);
  const [longPeriodFilters, setLongPeriodFilters] = useState([]);
  const [longDayFilters, setLongDayFilters] = useState([]);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const shiftOptions = ['오전', '오후', '저녁', '새벽', '오전~오후', '오후~저녁', '저녁~새벽', '새벽~오전', '풀타임'];
  const longPeriodOptions = [
    { label: '1주 이하', value: 'OneWeek' },
    { label: '1주~1개월', value: 'OneMonth' },
    { label: '1~3개월', value: 'ThreeMonths' },
    { label: '3~6개월', value: 'SixMonths' },
    { label: '6~12개월', value: 'OneYear' },
    { label: '1년 이상', value: 'MoreThanOneYear' },
  ];
  const longDayOptions = [
    { label: '월', value: 'MON' },
    { label: '화', value: 'TUE' },
    { label: '수', value: 'WED' },
    { label: '목', value: 'THU' },
    { label: '금', value: 'FRI' },
    { label: '토', value: 'SAT' },
    { label: '일', value: 'SUN' },
  ];
  // 근무 기간 필터: '단기' | '중장기'
  const [termFilter, setTermFilter] = useState('단기');
  // 헤더 표시는 실제 화면에 렌더된 목록 타입 기준으로 관리
  const [displayedRecruitType, setDisplayedRecruitType] = useState('short');
  // API에서 받아온 공고 목록/상태
  const [recruitJobs, setRecruitJobs] = useState([]);
  const [recruitTotalCount, setRecruitTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isRecruitLoading, setIsRecruitLoading] = useState(false);
  const [recruitError, setRecruitError] = useState('');
  // 정렬 옵션: 'latest' | 'pay' | 'workDate'
  const [sortOption, setSortOption] = useState('latest');
  const sortToApiMap = {
    latest: 'LATEST',
    pay: 'SALARY',
    workDate: 'DEADLINE',
  };
  const shiftToApiMap = {
    오전: 'MORNING',
    오후: 'AFTERNOON',
    저녁: 'EVENING',
    새벽: 'NIGHT',
    '오전~오후': 'MORNING_AFTERNOON',
    '오후~저녁': 'AFTERNOON_EVENING',
    '저녁~새벽': 'EVENING_NIGHT',
    '새벽~오전': 'NIGHT_MORNING',
    풀타임: 'FULLTIME',
  };
  const workTimeMap = {
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
  const longPeriodLabelMap = {
    OneWeek: '1주 이하',
    OneMonth: '1주~1개월',
    ThreeMonths: '1~3개월',
    SixMonths: '3~6개월',
    OneYear: '6~12개월',
    MoreThanOneYear: '1년 이상',
  };
  const longDayLabelMap = {
    MON: '월',
    TUE: '화',
    WED: '수',
    THU: '목',
    FRI: '금',
    SAT: '토',
    SUN: '일',
  };
  // today's date in YYYY-MM-DD (local) used as min for date input
  const todayLocal = (() => {
    const t = new Date();
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, '0');
    const dd = String(t.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  // load sigungu list whenever selectedSido changes (including mount)
  useEffect(() => {
    if (!selectedSido) return;
    fetch(`/api/brand/regionFilter/${encodeURIComponent(selectedSido)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        // data: array of Region { id, sido, sigungu }
        // reduce to unique sigungu entries, keep first id for each sigungu
        const map = {};
        (data || []).forEach((r) => {
          if (!r || !r.sigungu) return;
          if (!map[r.sigungu]) {
            map[r.sigungu] = { id: r.id, sido: r.sido, sigungu: r.sigungu };
          }
        });
        setSigunguOptions(Object.values(map));
        // do NOT clear selectedRegionId here because badge/selectedRegionId should persist
      })
      .catch(() => setSigunguOptions([]));
  }, [selectedSido]);

  const getBrandIdFromQuery = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('brandId');
  };

  const updateBrandIdQuery = (brandId) => {
    const url = new URL(window.location.href);
    url.searchParams.set('brandId', String(brandId));
    window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
  };

  const loadBrandSummary = (brandIdOverride) => {
    const brandId = brandIdOverride || getBrandIdFromQuery();
    if (!brandId) {
      setBrandSummary(defaultBrandSummary);
      return;
    }

    fetch(`/api/brand/${encodeURIComponent(brandId)}/summary`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setBrandSummary({
          name: data?.name || defaultBrandSummary.name,
          description: data?.description || defaultBrandSummary.description,
          bannerImg: data?.bannerImg || defaultBrandSummary.bannerImg,
          logoImg: data?.logoImg || defaultBrandSummary.logoImg,
        });
      })
      .catch(() => {
        setBrandSummary(defaultBrandSummary);
      });
  };

  const loadRecruits = ({ applyFilters = false, sortOptionOverride, pageOverride, urgentOnlyOverride, brandIdOverride } = {}) => {
    const brandId = brandIdOverride || getBrandIdFromQuery();
    if (!brandId) {
      setRecruitJobs([]);
      setRecruitTotalCount(0);
      setRecruitError('브랜드 정보를 확인할 수 없습니다.');
      return;
    }

    const endpoint = termFilter === '중장기' ? 'long' : 'short';
    const query = new URLSearchParams();
    const activePage = Math.max(1, pageOverride || currentPage);
    query.set('page', String(activePage));

    if (applyFilters) {
      if (selectedRegionId) query.set('region_id', String(selectedRegionId));

      if (endpoint === 'short') {
        workDates.forEach((d) => query.append('work_date', d));
      } else {
        longPeriodFilters.forEach((p) => query.append('work_period', p));
        longDayFilters.forEach((d) => query.append('work_days', d));
      }

      shiftFilters
        .map((s) => shiftToApiMap[s] || s)
        .forEach((w) => query.append('work_time', w));
    }

    // 급구 필터는 단기에서만 적용
    const activeUrgentOnly = typeof urgentOnlyOverride === 'boolean' ? urgentOnlyOverride : urgentOnly;
    if (endpoint === 'short' && activeUrgentOnly) {
      query.set('urgent_only', 'true');
    }

    // 정렬 파라미터는 항상 포함 (초기 조회/필터 조회 모두 적용)
    const activeSortOption = sortOptionOverride || sortOption;
    const sortParam = sortToApiMap[activeSortOption];
    if (sortParam) query.set('sort', sortParam);

    const queryString = query.toString();
    const url = `/api/brand/${encodeURIComponent(brandId)}/recruits/${endpoint}${queryString ? `?${queryString}` : ''}`;

    setIsRecruitLoading(true);
    setRecruitError('');

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((payload) => {
        const list = Array.isArray(payload?.recruits) ? payload.recruits : [];
        const totalCandidates = [
          payload?.totalCount,
          payload?.total_count,
          payload?.totalElements,
          payload?.pageInfo?.totalCount,
          payload?.pageInfo?.totalElements,
        ];
        const totalFromApi = totalCandidates.find((v) => Number.isFinite(v));
        const totalPagesCandidates = [
          payload?.totalPages,
          payload?.total_pages,
          payload?.pageInfo?.totalPages,
        ];
        const totalPagesFromApi = totalPagesCandidates.find((v) => Number.isFinite(v));
        const currentPageCandidates = [
          payload?.currentPage,
          payload?.current_page,
          payload?.page,
          payload?.pageInfo?.currentPage,
          payload?.pageInfo?.page,
        ];
        const currentPageFromApi = currentPageCandidates.find((v) => Number.isFinite(v));

        const mapped = list.map((r) => {
          const deadlineText = r?.deadline ? `마감 ${r.deadline}` : '';
          const workTimeText = r?.workTime ? (workTimeMap[r.workTime] || r.workTime) : '';
          const salaryTypeLabelMap = {
            HOURLY: '시급',
            MONTHLY: '월급',
          };
          const normalizedSalaryType = typeof r?.salaryType === 'string' ? r.salaryType.trim().toUpperCase() : '';
          const payLabelText = endpoint === 'long'
            ? (salaryTypeLabelMap[normalizedSalaryType] || '급여')
            : '시급';
           const scheduleText = [deadlineText, workTimeText].filter(Boolean).join(' / ');
           const workDateRaw = r?.workDate || r?.deadline || '';
           const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];
           const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
           const dayAliasMap = {
             MONDAY: 'MON',
             TUESDAY: 'TUE',
             WEDNESDAY: 'WED',
             THURSDAY: 'THU',
             FRIDAY: 'FRI',
             SATURDAY: 'SAT',
             SUNDAY: 'SUN',
           };
           const periodAliasMap = {
             oneweek: 'OneWeek',
             onemonth: 'OneMonth',
             threemonths: 'ThreeMonths',
             sixmonths: 'SixMonths',
             oneyear: 'OneYear',
             morethanoneyear: 'MoreThanOneYear',
           };
           let workDateText = '-';

           if (typeof workDateRaw === 'string' && workDateRaw.trim()) {
             const datePart = workDateRaw.trim().split(' ')[0];
             const normalized = datePart.replace(/\./g, '-');
             const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);

             if (match) {
               const year = Number(match[1]);
               const month = Number(match[2]);
               const day = Number(match[3]);
               const date = new Date(year, month - 1, day);

               if (!Number.isNaN(date.getTime())) {
                 const weekday = weekdayLabels[date.getDay()];
                 workDateText = `${match[1]}.${match[2]}.${match[3]}(${weekday})`;
               }
             }

             if (workDateText === '-') {
               workDateText = datePart.replace(/-/g, '.');
             }
           }

           const rawWorkDays = Array.isArray(r?.workDays)
             ? r.workDays
             : Array.isArray(r?.days)
               ? r.days
               : (typeof r?.workDays === 'string'
                 ? r.workDays.split(',')
                 : (typeof r?.days === 'string' ? r.days.split(',') : []));
           const normalizedWorkDays = rawWorkDays
             .map((d) => {
               if (!d) return null;
               let raw = '';
               if (typeof d === 'string') raw = d;
               if (typeof d === 'object') raw = String(d.day || d.workDay || d.code || d.value || '');
               const upper = raw.trim().toUpperCase();
               return dayAliasMap[upper] || upper;
             })
             .filter((d) => d && longDayLabelMap[d]);
           const sortedUniqueWorkDays = [...new Set(normalizedWorkDays)].sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
           const longWorkDaysText = sortedUniqueWorkDays.length > 0
             ? sortedUniqueWorkDays.map((d) => longDayLabelMap[d]).join(',')
             : '-';

           const rawWorkPeriods = Array.isArray(r?.workPeriods)
             ? r.workPeriods
             : Array.isArray(r?.workPeriod)
               ? r.workPeriod
               : (r?.workPeriod ? [r.workPeriod] : (r?.period ? [r.period] : []));
           const normalizedWorkPeriods = rawWorkPeriods
             .map((p) => {
               if (!p) return null;
               let raw = '';
               if (typeof p === 'string') raw = p;
               if (typeof p === 'object') raw = String(p.period || p.code || p.value || '');
               const trimmed = raw.trim();
               if (!trimmed) return null;
               const aliasKey = trimmed.replace(/_/g, '').toLowerCase();
               return periodAliasMap[aliasKey] || trimmed;
             })
             .filter((p) => p && longPeriodLabelMap[p]);
           const longWorkPeriodText = normalizedWorkPeriods.length > 0
             ? [...new Set(normalizedWorkPeriods)].map((p) => longPeriodLabelMap[p]).join(', ')
             : '-';

           return {
             brand: r?.companyName || '기업',
             title: r?.title || '공고 제목',
             location: r?.regionName || '지역 정보 없음',
             payLabel: payLabelText,
             pay: typeof r?.salary === 'number' ? `${r.salary.toLocaleString()}원` : (r?.salary || '-'),
             schedule: scheduleText || '-',
             posted: r?.createdAt || '-',
             urgent: r?.isUrgent === 'Y',
             recruitType: endpoint,
             workDate: workDateText,
             workTimeLabel: workTimeText || '-',
             longWorkDays: longWorkDaysText,
             longWorkPeriod: longWorkPeriodText,
             // 아이콘/로고는 보류: 기존 카드 스타일 유지를 위해 기본값만 사용
             icon: r?.isUrgent === 'Y' ? 'notifications_active' : 'bookmark',
             logo: urgentJobs[0]?.logo,
           };
        });

        setRecruitJobs(mapped);
        setDisplayedRecruitType(endpoint);
        setRecruitTotalCount(Number.isFinite(totalFromApi) ? totalFromApi : mapped.length);
        const resolvedTotalPages = Number.isFinite(totalPagesFromApi)
          ? totalPagesFromApi
          : (Number.isFinite(totalFromApi) ? Math.ceil(totalFromApi / 20) : Math.ceil(mapped.length / 20));
        setTotalPages(resolvedTotalPages || 0);
        setCurrentPage(Number.isFinite(currentPageFromApi) ? currentPageFromApi : activePage);
      })
      .catch(() => {
        setRecruitJobs([]);
        setRecruitTotalCount(0);
        setTotalPages(0);
        setCurrentPage(1);
        setRecruitError('공고를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
      })
      .finally(() => {
        setIsRecruitLoading(false);
      });
  };

  // brandId 쿼리 기반 기본 공고 조회
  useEffect(() => {
    loadBrandSummary();
    loadRecruits({ pageOverride: 1 });
  }, []);

  const handleBrandSelectFromModal = ({ brandId }) => {
    if (!brandId) return;
    updateBrandIdQuery(brandId);
    setCurrentPage(1);
    loadBrandSummary(brandId);
    loadRecruits({ pageOverride: 1, brandIdOverride: brandId });
  };
  return (
    <>
      <TopNavBar />

      <main className="pt-20 bg-white">
        <section className="bg-white pt-10 pb-8">
          <div className="custom-container">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden">
              <img
                alt="Brand Banner"
                className="w-full h-full object-cover"
                src={brandSummary.bannerImg}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10 flex items-end gap-6">
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-3 shadow-lg">
                  <img
                    alt={`${brandSummary.name} Logo`}
                    className="w-full h-auto"
                    src={brandSummary.logoImg}
                  />
                </div>
                <div className="mb-1 text-white">
                  <h1 className="text-4xl font-black tracking-tight">{brandSummary.name}</h1>
                  <p className="text-white/80 text-base font-medium mt-1">{brandSummary.description}</p>
                </div>
              </div>
            </div>
            {/*
            <div className="mt-6 flex justify-between items-center p-6 bg-white border-[0.5px] border-outline rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <button className="flex items-center gap-2 text-on-surface-variant font-bold text-sm hover:text-primary transition-colors">
                브랜드 상세정보 보기
                <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="bg-primary-soft text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-primary/10">진행중 공고 4,291</span>
              </div>
            </div>
            */}

            {/* 대신: 브랜드 변경 버튼 */}
            <div className="mt-6 flex justify-end">
              <CommonButton size="md" className="px-4 py-2" onClick={() => setIsModalOpen(true)}>브랜드 변경</CommonButton>
            </div>
          </div>
        </section>

        <section className="bg-[#f9f9f9] py-10">
          <div className="custom-container space-y-6">
            {/*
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <div className="bg-white border-[0.5px] border-outline p-4 rounded-xl flex justify-between items-center cursor-pointer group shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                  <span className="font-bold text-on-surface">편의점</span>
                  <span className="material-symbols-outlined text-primary group-hover:rotate-180 transition-transform">expand_more</span>
                </div>
              </div>
              <div className="md:col-span-9 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {brandTabs.map((tab, index) => (
                  <button
                    key={tab}
                    className={`px-7 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
                      index === 0
                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                        : 'bg-white border border-outline text-on-surface hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            */}

                    {/* 기간 필터 (전체 / 단기 / 중장기) */}
                    <nav className="mb-4">
                      <div className="flex gap-6">
                        {['단기', '중장기'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setTermFilter(t);
                              if (t === '중장기') {
                                setWorkDates([]);
                                setUrgentOnly(false);
                              } else {
                                // when switching to 단기, clear long-term-only filters
                                setLongPeriodFilters([]);
                                setLongDayFilters([]);
                              }
                            }}
                            className={`pb-2 text-lg font-semibold ${termFilter === t ? 'text-primary border-b-2 border-primary -mb-[1px]' : 'text-on-surface-variant hover:text-primary'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </nav>

                    <div className="bg-white border-[0.5px] border-outline p-6 rounded-2xl flex flex-wrap items-center gap-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-background border border-outline rounded-lg text-sm font-bold text-on-surface-variant hover:border-primary/30 transition-colors"
                onClick={() => {
                  // if region already open -> close it; otherwise open region and close work-condition
                  if (isRegionOpen) {
                    setIsRegionOpen(false);
                  } else {
                    setIsRegionOpen(true);
                    setIsWorkConditionOpen(false);
                    // do not reset selectedSido/sigungu here so user selection (badge) is preserved
                  }
                }}
              >
                지역
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-background border border-outline rounded-lg text-sm font-bold text-on-surface-variant hover:border-primary/30 transition-colors"
                onClick={() => {
                  setIsWorkConditionOpen((v) => !v);
                  setIsRegionOpen(false);
                }}
              >
                근무조건
                <span className="material-symbols-outlined text-sm">tune</span>
              </button>
              {/* ...existing code... */}
              {termFilter === '단기' && (
                <div className="ml-auto flex items-center gap-3">
                  <label className="relative flex items-center cursor-pointer gap-2">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      checked={urgentOnly}
                      onChange={(e) => {
                        const next = e.target.checked;
                        setUrgentOnly(next);
                        setCurrentPage(1);
                        loadRecruits({ applyFilters: true, pageOverride: 1, urgentOnlyOverride: next });
                      }}
                    />
                    <div className="w-6 h-6 border-2 border-outline rounded-md flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-all">
                      <span className="material-symbols-outlined text-[16px] text-white hidden peer-checked:block">check</span>
                    </div>
                    <span className="text-sm font-bold text-primary">급구만 보기</span>
                  </label>
                </div>
              )}
            </div>

          {/* badge row will be rendered below region/workcondition selectors */}

            {/* region selector: shown when 지역 버튼 toggled; when 근무조건 is opened show empty same-sized box */}
            {isWorkConditionOpen ? (
              termFilter === '단기' ? (
                <div className="bg-white rounded-2xl border-[0.5px] border-outline shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden grid grid-cols-2 h-72">
                  <div className="bg-[#f9f9f9] overflow-y-auto border-r border-outline p-4">
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">근무일자 선택</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        min={todayLocal}
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                        className="px-3 py-2 border border-outline rounded-md bg-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!tempDate) return;
                          if (tempDate < todayLocal) {
                            window.alert('오늘 이후의 날짜만 선택할 수 있습니다.');
                            return;
                          }
                          if (!workDates.includes(tempDate)) {
                            setWorkDates((prev) => [...prev, tempDate]);
                            setTempDate('');
                          }
                        }}
                        className="px-3 py-2 bg-primary text-white rounded-md text-sm font-medium"
                      >
                        추가
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs text-on-surface-variant mb-2">선택된 근무일자</div>
                      <div className="flex flex-wrap gap-2">
                        {workDates.length === 0 && (
                          <div className="text-sm text-on-surface-variant">선택된 날짜가 없습니다.</div>
                        )}
                        {workDates.map((d) => (
                          <div key={d} className="flex items-center gap-2 px-2 py-1 bg-white border border-outline rounded-md text-sm">
                            <span>{d}</span>
                            <button
                              type="button"
                              onClick={() => setWorkDates((prev) => prev.filter((x) => x !== d))}
                              className="text-on-surface-variant hover:text-on-surface"
                              aria-label="날짜 삭제"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-y-auto p-4">
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">근무시간</label>
                    <div className="grid grid-cols-3 gap-2">
                      {shiftOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setShiftFilters((prev) => (prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]));
                          }}
                          className={`px-2 py-1.5 rounded-sm text-xs font-medium transition-colors border flex items-center justify-center ${
                            shiftFilters.includes(opt)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white border-outline text-on-surface-variant hover:bg-gray-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border-[0.5px] border-outline shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden grid grid-cols-3 h-72">
                  <div className="bg-[#f9f9f9] overflow-y-auto border-r border-outline p-4">
                    <label className="block text-sm font-medium text-on-surface-variant mb-3">근무기간</label>
                    <div className="grid grid-cols-2 gap-2">
                      {longPeriodOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setLongPeriodFilters((prev) => (prev.includes(opt.value) ? prev.filter((x) => x !== opt.value) : [...prev, opt.value]));
                          }}
                          className={`px-2 py-1.5 rounded-sm text-xs font-medium transition-colors border ${
                            longPeriodFilters.includes(opt.value)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white border-outline text-on-surface-variant hover:bg-gray-50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white overflow-y-auto border-r border-outline p-4">
                    <label className="block text-sm font-medium text-on-surface-variant mb-3">근무요일</label>
                    <div className="grid grid-cols-4 gap-2">
                      {longDayOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setLongDayFilters((prev) => (prev.includes(opt.value) ? prev.filter((x) => x !== opt.value) : [...prev, opt.value]));
                          }}
                          className={`px-2 py-1.5 rounded-sm text-xs font-medium transition-colors border ${
                            longDayFilters.includes(opt.value)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white border-outline text-on-surface-variant hover:bg-gray-50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white overflow-y-auto p-4">
                    <label className="block text-sm font-medium text-on-surface-variant mb-3">근무시간</label>
                    <div className="grid grid-cols-3 gap-2">
                      {shiftOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setShiftFilters((prev) => (prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]));
                          }}
                          className={`px-2 py-1.5 rounded-sm text-xs font-medium transition-colors border flex items-center justify-center ${
                            shiftFilters.includes(opt)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white border-outline text-on-surface-variant hover:bg-gray-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ) : isRegionOpen ? (
              <div className="bg-white rounded-2xl border-[0.5px] border-outline shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden grid grid-cols-3 h-72">
                <div className="bg-[#f9f9f9] overflow-y-auto border-r border-outline">
                  {[
                    '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시',
                    '울산광역시', '세종특별자치시', '경기도', '강원특별자치도', '충청북도', '충청남도',
                    '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
                  ].map((sido) => (
                    <div
                      key={sido}
                          onClick={() => {
                            setSelectedSido(sido);
                            setSelectedSigungu(null);
                            setSelectedDong(null);
                          fetch(`/api/brand/regionFilter/${encodeURIComponent(sido)}`)
                            .then((res) => {
                              if (!res.ok) throw new Error('Network response was not ok');
                              return res.json();
                            })
                            .then((data) => {
                              const map = {};
                              (data || []).forEach((r) => {
                                if (!r || !r.sigungu) return;
                                if (!map[r.sigungu]) {
                                  map[r.sigungu] = { id: r.id, sido: r.sido, sigungu: r.sigungu };
                                }
                              });
                              setSigunguOptions(Object.values(map));
                            })
                            .catch(() => setSigunguOptions([]));
                        }}
                      className={
                        'p-4 text-sm font-medium transition-colors cursor-pointer ' +
                        (selectedSido === sido ? 'bg-white font-bold border-r-4 border-primary text-primary' : 'text-on-surface-variant hover:bg-white')
                      }
                    >
                      {sido}
                    </div>
                  ))}
                </div>
                <div className="bg-white overflow-y-auto border-r border-outline">
                  {sigunguOptions.length === 0 ? (
                    <div className="p-4 text-sm text-on-surface-variant">시/군/구 정보가 없습니다.</div>
                  ) : (
                    sigunguOptions.map((opt) => (
                      <div
                        key={opt.sigungu}
                        onClick={() => {
                          setSelectedSido(opt.sido);
                          setSelectedSigungu(opt.sigungu);
                          setSelectedDong(null);
                          setSelectedRegionId(opt.id);
                          // update badge separately so it persists across sido changes
                          setBadgeSido(opt.sido);
                          setBadgeSigungu(opt.sigungu);
                        }}
                        className={
                          'p-4 text-sm transition-colors cursor-pointer ' +
                          (selectedSigungu === opt.sigungu ? 'font-bold bg-[#f9f9f9] text-on-surface' : 'text-on-surface-variant hover:bg-[#f9f9f9]')
                        }
                      >
                        {opt.sigungu}
                      </div>
                    ))
                  )}
                </div>
                <div className="bg-white overflow-y-auto">
                  {/* emptied */}
                </div>
              </div>
            ) : null}

          {/* badge row: show selected region badge (only when sigungu selected) and other active filter badges (dates, 근무타입) - moved below selectors */}
          {(badgeSigungu || workDates.length > 0 || shiftFilters.length > 0 || longPeriodFilters.length > 0 || longDayFilters.length > 0) && (
            <div className="mt-3">
              <div className="bg-white border-[0.5px] border-outline p-3 rounded-2xl flex items-center gap-2">
                {badgeSigungu && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-outline rounded-md text-sm font-medium">
                    <span className="text-on-surface-variant">{badgeSido}{badgeSigungu ? ` · ${badgeSigungu}` : ''}</span>
                    <button
                      type="button"
                      onClick={() => {
                        // clear badge selections and related backend id
                        setBadgeSido(null);
                        setBadgeSigungu(null);
                        setSelectedSigungu(null);
                        setSelectedDong(null);
                        setSigunguOptions([]);
                        setSelectedRegionId(null);
                      }}
                      className="ml-2 text-on-surface-variant hover:text-on-surface"
                      aria-label="선택 해제"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                )}

                {workDates.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {workDates.map((d) => (
                      <div key={d} className="flex items-center gap-2 px-2 py-1 bg-white border border-outline rounded-md text-sm">
                        <span>{d}</span>
                        <button
                          type="button"
                          onClick={() => setWorkDates((prev) => prev.filter((x) => x !== d))}
                          className="text-on-surface-variant hover:text-on-surface"
                          aria-label="날짜 삭제"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {shiftFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {shiftFilters.map((s) => (
                      <div key={s} className="flex items-center gap-2 px-3 py-1 bg-white border border-outline rounded-md text-sm font-medium">
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => setShiftFilters((prev) => prev.filter((x) => x !== s))}
                          className="text-on-surface-variant hover:text-on-surface"
                          aria-label="근무타입 삭제"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {longPeriodFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {longPeriodFilters.map((p) => (
                      <div key={p} className="flex items-center gap-2 px-3 py-1 bg-white border border-outline rounded-md text-sm font-medium">
                        <span>{longPeriodLabelMap[p] || p}</span>
                        <button
                          type="button"
                          onClick={() => setLongPeriodFilters((prev) => prev.filter((x) => x !== p))}
                          className="text-on-surface-variant hover:text-on-surface"
                          aria-label="근무기간 삭제"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {longDayFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {longDayFilters.map((d) => (
                      <div key={d} className="flex items-center gap-2 px-3 py-1 bg-white border border-outline rounded-md text-sm font-medium">
                        <span>{longDayLabelMap[d] || d}</span>
                        <button
                          type="button"
                          onClick={() => setLongDayFilters((prev) => prev.filter((x) => x !== d))}
                          className="text-on-surface-variant hover:text-on-surface"
                          aria-label="근무요일 삭제"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* 전체 해제 버튼 (우측 하단) */}
                <button
                  type="button"
                  onClick={() => {
                    // clear all filters/badges
                    setBadgeSido(null);
                    setBadgeSigungu(null);
                    setSelectedSigungu(null);
                    setSelectedDong(null);
                    setSigunguOptions([]);
                    setSelectedRegionId(null);
                    setWorkDates([]);
                    setShiftFilters([]);
                    setLongPeriodFilters([]);
                    setLongDayFilters([]);
                    setUrgentOnly(false);
                  }}
                  className="ml-auto px-3 py-1 bg-white border border-outline rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  전체 해제
                </button>
              </div>
            </div>
          )}
          {/* 검색 버튼: 배지 영역 아래 우측 */}
          <div className="mt-2 flex justify-end">
            <CommonButton
              size="md"
              className="px-4 py-2"
              onClick={() => {
                setCurrentPage(1);
                loadRecruits({ applyFilters: true, pageOverride: 1 });
              }}
            >
              검색
            </CommonButton>
          </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="custom-container">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter">{displayedRecruitType === 'long' ? '중장기' : '단기'} 공고 <span className="text-primary">{recruitTotalCount.toLocaleString('ko-KR')}</span>건</h2>
              </div>
              <div className="flex gap-2 bg-outline/20 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSortOption('latest');
                    setCurrentPage(1);
                    loadRecruits({ applyFilters: true, sortOptionOverride: 'latest', pageOverride: 1 });
                  }}
                  className={`px-5 py-1.5 rounded-md text-sm font-bold shadow-sm ${
                    sortOption === 'latest' ? 'bg-white text-on-surface' : 'text-on-surface-variant hover:text-on-surface transition-colors'
                  }`}
                >
                  최신순
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSortOption('pay');
                    setCurrentPage(1);
                    loadRecruits({ applyFilters: true, sortOptionOverride: 'pay', pageOverride: 1 });
                  }}
                  className={`px-5 py-1.5 rounded-md text-sm font-bold ${
                    sortOption === 'pay' ? 'bg-white text-on-surface' : 'text-on-surface-variant hover:text-on-surface transition-colors'
                  }`}
                >
                  시급순
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSortOption('workDate');
                    setCurrentPage(1);
                    loadRecruits({ applyFilters: true, sortOptionOverride: 'workDate', pageOverride: 1 });
                  }}
                  className={`px-5 py-1.5 rounded-md text-sm font-bold ${
                    sortOption === 'workDate' ? 'bg-white text-on-surface' : 'text-on-surface-variant hover:text-on-surface transition-colors'
                  }`}
                >
                  근무일순
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {isRecruitLoading && (
                <div className="bg-white border-[0.5px] border-outline p-10 rounded-2xl text-center text-on-surface-variant">
                  공고를 불러오는 중입니다.
                </div>
              )}

              {!isRecruitLoading && recruitError && (
                <div className="bg-white border-[0.5px] border-outline p-10 rounded-2xl text-center text-on-surface-variant">
                  {recruitError}
                </div>
              )}

              {!isRecruitLoading && !recruitError && recruitJobs.length === 0 && (
                <div className="bg-white border-[0.5px] border-outline p-10 rounded-2xl text-center text-on-surface-variant">
                  선택한 조건에 맞는 공고가 없습니다.
                </div>
              )}

              {!isRecruitLoading && !recruitError && recruitJobs.map((job) => (
                <div
                  key={`${job.brand}-${job.title}`}
                  className={`${job.urgent ? 'bg-primary-soft' : 'bg-white'} border-[0.5px] border-outline shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-6 rounded-2xl relative group hover:shadow-lg transition-all`}
                >
                  {job.urgent && (
                    <div className="absolute top-8 right-8">
                      <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>{job.icon}</span>
                    </div>
                  )}

                  <div className="flex gap-6">
                    <div className={`w-16 h-16 ${job.urgent ? 'bg-white' : 'bg-[#f9f9f9]'} rounded-xl flex-shrink-0 overflow-hidden border-[0.5px] border-outline p-2`}>
                      <img alt="Brand Icon" className="w-full h-full object-contain" src={job.logo} />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${job.urgent ? 'text-primary' : 'text-on-surface-variant'}`}>{job.brand}</span>
                        {job.urgent && (
                          <div className="bg-primary text-white px-2 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span>
                            긴급
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg md:text-xl leading-tight font-bold tracking-tight group-hover:text-primary transition-colors">{job.title}</h3>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-on-surface-variant">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-lg">location_on</span>
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-on-surface">
                          <span className="material-symbols-outlined text-lg text-primary">payments</span>
                          {job.payLabel} <span className={`font-black ml-1 ${job.urgent ? 'text-primary' : ''}`}>{job.pay}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-lg">schedule</span>
                          {job.schedule}
                        </div>
                      </div>

                      <div className="pt-1 text-[10px] font-medium text-on-surface-variant/60">{job.posted}</div>
                    </div>

                    {(job.recruitType || 'short') === 'short' ? (
                      <div className={`hidden md:flex min-w-[140px] mr-4 flex-col items-end justify-center text-right ${job.urgent ? 'pr-8' : ''}`}>
                        <div className={`text-2xl font-extrabold tracking-tight ${job.urgent ? 'text-primary' : 'text-on-surface'}`}>{job.workDate}</div>
                        <div className="mt-1 text-base font-semibold text-on-surface-variant">{job.workTimeLabel}</div>
                      </div>
                    ) : (
                      <div className={`hidden md:flex min-w-[180px] mr-4 flex-col items-end justify-center gap-1 text-right ${job.urgent ? 'pr-8' : ''}`}>
                        <div className="text-base font-semibold text-on-surface">{job.longWorkDays}</div>
                        <div className="text-lg font-semibold text-on-surface-variant">{job.workTimeLabel}</div>
                        <div className="text-base font-medium text-on-surface-variant">{job.longWorkPeriod}</div>
                      </div>
                    )}

                    {!job.urgent && (
                      <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors self-start">bookmark</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 0 && (
              <div className="mt-16 flex justify-center items-center gap-3">
                <CommonButton
                  variant="pagination"
                  size="squareLg"
                  disabled={currentPage <= 1 || isRecruitLoading}
                  onClick={() => {
                    const prev = Math.max(1, currentPage - 1);
                    setCurrentPage(prev);
                    loadRecruits({ applyFilters: true, pageOverride: prev });
                  }}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </CommonButton>

                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i,
                )
                  .filter((p, idx, arr) => p >= 1 && p <= totalPages && arr.indexOf(p) === idx)
                  .map((pageNum) => (
                    <CommonButton
                      key={pageNum}
                      variant="pagination"
                      size="squareLg"
                      active={currentPage === pageNum}
                      disabled={isRecruitLoading}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        loadRecruits({ applyFilters: true, pageOverride: pageNum });
                      }}
                    >
                      {pageNum}
                    </CommonButton>
                  ))}

                <CommonButton
                  variant="pagination"
                  size="squareLg"
                  disabled={currentPage >= totalPages || isRecruitLoading}
                  onClick={() => {
                    const next = Math.min(totalPages, currentPage + 1);
                    setCurrentPage(next);
                    loadRecruits({ applyFilters: true, pageOverride: next });
                  }}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </CommonButton>
              </div>
            )}
          </div>
        </section>
      </main>

      <AppFooter />

      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectBrand={handleBrandSelectFromModal}
      />

      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-white/95 backdrop-blur-lg border-t-[0.5px] border-outline flex justify-around items-center px-6 pb-safe z-50">
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold mt-1">홈</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>list_alt</span>
          <span className="text-[10px] font-bold mt-1">공고</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">distance</span>
          <span className="text-[10px] font-bold mt-1">주변</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="text-[10px] font-bold mt-1">채팅</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold mt-1">내정보</span>
        </a>
      </nav>

    </>
  );
}
