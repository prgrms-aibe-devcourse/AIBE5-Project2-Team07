import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 업직종 한글 매핑
const BUSINESS_TYPE_LABELS = {
  FOOD_RESTAURANT: '외식(음식점)',
  CAFE: '카페',
  RETAIL_STORE: '매장관리·판매',
  SERVICE: '서비스',
  DELIVERY_DRIVER: '운전·배달',
  MANUAL_LABOR: '현장단순노무',
};

// 브랜드 목록
const BRAND_OPTIONS = [
  { id: 1, name: '쿠팡', businessType: 'MANUAL_LABOR' },
  { id: 2, name: 'CJ대한통운', businessType: 'MANUAL_LABOR' },
  { id: 3, name: '한진택배', businessType: 'MANUAL_LABOR' },
  { id: 4, name: '롯데택배', businessType: 'MANUAL_LABOR' },
  { id: 5, name: '로젠택배', businessType: 'MANUAL_LABOR' },

  { id: 6, name: 'CU', businessType: 'RETAIL_STORE' },
  { id: 7, name: 'GS25', businessType: 'RETAIL_STORE' },
  { id: 8, name: '세븐일레븐', businessType: 'RETAIL_STORE' },
  { id: 9, name: '이마트24', businessType: 'RETAIL_STORE' },

  { id: 10, name: '스타벅스', businessType: 'CAFE' },
  { id: 11, name: '메가커피', businessType: 'CAFE' },
  { id: 12, name: '투썸플레이스', businessType: 'CAFE' },
  { id: 13, name: '공차', businessType: 'CAFE' },
  { id: 14, name: '매머드커피', businessType: 'CAFE' },
  { id: 15, name: '빽다방', businessType: 'CAFE' },
  { id: 16, name: '컴포즈커피', businessType: 'CAFE' },
  { id: 17, name: '이디야', businessType: 'CAFE' },
  { id: 18, name: '커피빈', businessType: 'CAFE' },

  { id: 19, name: '롯데리아', businessType: 'FOOD_RESTAURANT' },
  { id: 20, name: '맥도날드', businessType: 'FOOD_RESTAURANT' },
  { id: 21, name: '맘스터치', businessType: 'FOOD_RESTAURANT' },
  { id: 22, name: '버거킹', businessType: 'FOOD_RESTAURANT' },
  { id: 23, name: '써브웨이', businessType: 'FOOD_RESTAURANT' },
  { id: 24, name: 'KFC', businessType: 'FOOD_RESTAURANT' },
  { id: 25, name: '도미노피자', businessType: 'FOOD_RESTAURANT' },
  { id: 26, name: '피자헛', businessType: 'FOOD_RESTAURANT' },
  { id: 27, name: '교촌치킨', businessType: 'FOOD_RESTAURANT' },
  { id: 28, name: 'BBQ', businessType: 'FOOD_RESTAURANT' },
  { id: 29, name: 'BHC', businessType: 'FOOD_RESTAURANT' },
  { id: 30, name: '배스킨라빈스', businessType: 'FOOD_RESTAURANT' },
  { id: 31, name: '역전할머니맥주', businessType: 'FOOD_RESTAURANT' },
  { id: 32, name: '한신포차', businessType: 'FOOD_RESTAURANT' },
  { id: 33, name: '투다리', businessType: 'FOOD_RESTAURANT' },
  { id: 34, name: '던킨', businessType: 'FOOD_RESTAURANT' },
  { id: 35, name: '뚜레쥬르', businessType: 'FOOD_RESTAURANT' },
  { id: 36, name: '파리바게뜨', businessType: 'FOOD_RESTAURANT' },

  { id: 37, name: '3POP PC방', businessType: 'RETAIL_STORE' },
  { id: 38, name: '아이센스리그 PC방', businessType: 'RETAIL_STORE' },
  { id: 39, name: '레드포스 PC방', businessType: 'RETAIL_STORE' },

  { id: 40, name: '배달의민족', businessType: 'DELIVERY_DRIVER' },
  { id: 41, name: '쿠팡이츠', businessType: 'DELIVERY_DRIVER' },
  { id: 42, name: '요기요', businessType: 'DELIVERY_DRIVER' },
  { id: 43, name: '땡겨요', businessType: 'DELIVERY_DRIVER' },
];

// API 실패 시 fallback 용 더미 데이터
const DUMMY_PREMIUM_TALENTS = [
  {
    id: 1001,
    name: '김민수',
    rating: 4.9,
    experience: '경력 5년 3개월 · 카페 바리스타',
    location: '서울 강남구',
    tags: ['#영어가능', '#보건증소지'],
    image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuArunN_olGkZSUoydiSUq0VzjWUGoDaAlVcpaSzDWLVI0V_hF26fu1UTj_x4Y_zoNhkqf3LNGzF0Ix3IA94b8vsJakSoaTZuWwiNVe4XSG7NEzFKV4L1NA2oFiMG8FnWz3YaIslHV87wFG5Sr2ez_KSUbC5m45YJvvj0KUjNpIaMJvcmHKmcQVf_7jENbKUn8Vv0_mu3FZdJisKCE4ydkrTRfMj95oz2l4nGoOTF5Z6yqQrF8kgam36MW5LVnvzSplN4b57XKckuLg',
    status: '베테랑',
    job: '희망: 카페 · 서비스',
    activeResponse: true,
  },
  {
    id: 1002,
    name: '이서윤',
    rating: 5.0,
    experience: '경력 3년 · 컨벤션 리셉션',
    location: '서울 마포구',
    tags: ['#친절매너', '#정장소지'],
    image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAeL2oSeqzSISSJtgD0uv0FUBA_cjvaIfseCK8-poH6GA-3Ro3AOYyyUWg3W2ktJGNdaLvIXe1S0OJUhtXo2ccKI4MzEX4c2m5CfU7M1KiGaa026B_kcs10pD1TOS1vB80mKzfFSpItYJL-V17WVK_c_x-oDfU_Cb_uJVBsXKYG5It80KKckV2ckjZ7xqZMAW94v4irF_GxGXaB3WL0_sgYhe2fctGcxkI70iJ4x0ZzIeFSV6MKMHmOiyqlaIcMq8m2MojeNo3C2Dk',
    status: '베테랑',
    job: '희망: 서비스',
    activeResponse: true,
  },
  {
    id: 1003,
    name: '박진우',
    rating: 4.8,
    experience: '경력 8년 · 베테랑 셰프',
    location: '경기 성남시',
    tags: ['#베테랑', '#칼질능숙'],
    image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD5KwGPXMepx5X3t7sCFQ_JtQMp6_b--2dzFfrbULJi52efHUDzm8He2A6mRo1oikWwJSHKbgIM6k08H57LaupzXAQbAlfNIrlBn4DFeRKBvlLMF2vktoCzlKn_pTQ9t1JGAQzUNcnK_Sg4d8GHAX1-eqHs39uJS6l3DiUEqXKFWpH0-BrQTG6QAxx-qRjELuykElTmO-m5bQNY79AGkAfRYo8ZYfQvCi5ZVI15PPVfvwi1zX2ElH0qlJiWhFAGFW-Jh31OlW1cdtA',
    status: '베테랑',
    job: '희망: 외식(음식점)',
    activeResponse: true,
  },
  {
    id: 1004,
    name: '최유진',
    rating: 4.9,
    experience: '경력 2년 · 피팅매장 판매',
    location: '서울 서초구',
    tags: ['#판매왕', '#밝은성격'],
    image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBvsohhyoQXE5qnOIIN38jiSfFzUFZujzpiU8GV-xFMBxXlA4zSZBEx1K-GOO37PtBa7oxN_7Ivwcib80Js3G1Xjz2Py7wrYocV5-wa0TXoDVrgZBRhk1fmPRzzFHT1QwF3eZjuyE7e685sqPgT42sgjli8Zko-be1pzUav8ajwmUuF3_uGcqhoPg6_CPQ5fMVhoK-8P_RDnYII0EMddseixZ3zsM4n_rahg47coQGFB5Qub0skT3VKh9ErnjSBVIxkj4JZXMjh4mI',
    status: '활동중',
    job: '희망: 매장관리·판매',
    activeResponse: false,
  },
];

const DUMMY_TALENT_LIST = [
  {
    id: 2001,
    name: '정한결',
    rating: 4.7,
    status: '활동중',
    location: '서울 강남구',
    job: '희망: 운전·배달 · 현장단순노무',
    experience: '경력 4년 2개월',
    activeResponse: true,
    image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD_XhYdmR6qXF3-vwbIM2chfgViThiOqRAWTxqAtrRCYw6jLOMxyjLAQ4J6uBHv36npuA6PDU8FO53p91K8SdtVc0E6_iC0fcaCfm1t-AWQlZ79mw0JbqwctByAgeKUXu1gGy-Dx6B9OxrSty_e6RKzmeFAs_di9m-D3Gh9yVSNKjJXQsQnI-ZT7rlc0tmu_0ZZ4ZreYjeoggeL6TZ9BDxlRgeAyNCKcvKAA9HguOBc4RqKww3pWO7Bzz7Jwr3j3pLtyMC1ZIUfcKc',
  },
  {
    id: 2002,
    name: '이지은',
    rating: 4.9,
    status: '활동중',
    location: '서울 마포구',
    job: '희망: 외식(음식점) · 서비스',
    experience: '신입',
    activeResponse: false,
    image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBXHwyWLng1LHsd0Qr61B0Ek7YcqRU1y2hlD093z4rJ9tDhrYT8DYHNwJn1h4OQnfaK59NA7ga_-862qWdCAYZ86ZS8-PqlzA5Hxw4ERX103y_zRpapMGVTMr55oz4YLpxeyrE9-NGWclf0aCZ9WdUs6biBrcr1ZGkMNtqpuBTOv0EvddCVpXezrKTy0TwM9XfL0zkp-5f_y-k7dzw24He3Bj9tPlNZH73eF5GkGHKcaASMpY1RgztOIVLXB2clfLKoo76cDdFVdeM',
  },
  {
    id: 2003,
    name: '장준호',
    rating: 5.0,
    status: '베테랑',
    location: '서울 서초구',
    job: '희망: 외식(음식점) · 서비스',
    experience: '경력 12년',
    activeResponse: true,
    image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCukrr68GI0dFfnTx-ZlBjubPJ445yiwuyTeRXhD7EGeRsynwlLvubXZrJams7Tc8ukO7DFTmToy1BgdC0Euyi-Dufu1kyf5JzxD0Hpm5wVSaeXUTDmFFvSuhCCCXAGCeoPLA-aHhQ9CrDyhZYHDC9msycnvSABzDLX8KcIEndRZWKOEx9y_OmFRmKScseK_nja6RibBjRrl2YSlGXXiQpaeWigQ756RqlkeeeZ_GL4-WCVzO0GmievdZuxCmHRPv_J4sMVQHd0wG8',
  },
  {
    id: 2004,
    name: '최민아',
    rating: 4.8,
    status: '활동중',
    location: '서울 강남구',
    job: '희망: 서비스',
    experience: '경력 2년',
    activeResponse: false,
    image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAeL2oSeqzSISSJtgD0uv0FUBA_cjvaIfseCK8-poH6GA-3Ro3AOYyyUWg3W2ktJGNdaLvIXe1S0OJUhtXo2ccKI4MzEX4c2m5CfU7M1KiGaa026B_kcs10pD1TOS1vB80mKzfFSpItYJL-V17WVK_c_x-oDfU_Cb_uJVBsXKYG5It80KKckV2ckjZ7xqZMAW94v4irF_GxGXaB3WL0_sgYhe2fctGcxkI70jJ4x0ZzIeFSV6MKMHmOiyqlaIcMq8m2MojeNo3C2Dk',
  },
];

function formatRegions(preferredRegions) {
  if (!Array.isArray(preferredRegions) || preferredRegions.length === 0) {
    return '지역 정보 없음';
  }

  return preferredRegions
      .map((region) => {
        if (!region) return '';
        const sido = region.sido ?? '';
        const sigungu = region.sigungu ?? '';
        return `${sido} ${sigungu}`.trim();
      })
      .filter(Boolean)
      .join(' · ');
}

function translateBusinessType(type) {
  return BUSINESS_TYPE_LABELS[type] || type;
}

function formatDesiredTypes(desiredBusinessTypes) {
  if (!Array.isArray(desiredBusinessTypes) || desiredBusinessTypes.length === 0) {
    return '희망 업직종 정보 없음';
  }

  const translated = desiredBusinessTypes.map(translateBusinessType);
  return `희망: ${translated.join(' · ')}`;
}

function mapDesiredTypesToTags(desiredBusinessTypes) {
  if (!Array.isArray(desiredBusinessTypes)) return [];
  return desiredBusinessTypes.slice(0, 2).map((v) => `#${translateBusinessType(v)}`);
}

function mapResumeToTalent(resume) {
  return {
    id: resume.resumeId ?? resume.id,
    memberId: resume.memberId,
    name: resume.memberName ?? resume.name ?? '이름 없음',
    rating: Number(resume.ratingAverage ?? resume.avgRating ?? 0).toFixed(1),
    status: (resume.ratingAverage ?? resume.avgRating ?? 0) >= 4.8 ? '베테랑' : '활동중',
    location: formatRegions(resume.preferredRegions),
    job: formatDesiredTypes(resume.desiredBusinessTypes ?? resume.desiredTypes),
    experience: resume.title ?? '이력서 제목 없음',
    activeResponse: false,
    tags: mapDesiredTypesToTags(resume.desiredBusinessTypes ?? resume.desiredTypes ?? []),
    image:
        'https://cdn-icons-png.flaticon.com/512/2815/2815428.png',
  };
}

async function fetchJsonWithFallback(url, fallbackData) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`API 호출 실패, 더미데이터 사용: ${url}`, error);
    return fallbackData;
  }
}

async function fetchResumeItems(url, fallbackData = { content: DUMMY_TALENT_LIST }) {
  const data = await fetchJsonWithFallback(url, fallbackData);
  return Array.isArray(data) ? data : data.content ?? [];
}

export default function HumanInformationPage() {
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSearchPage, setShowSearchPage] = useState(false);

  const [premiumTalents, setPremiumTalents] = useState([]);
  const [talentList, setTalentList] = useState([]);
  const [loadingPremium, setLoadingPremium] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState('');

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  const [regionOptions, setRegionOptions] = useState([]);
  const [selectedRegionIds, setSelectedRegionIds] = useState([]);
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);
  const [brandKeyword, setBrandKeyword] = useState('');
  const [brandFilterBusinessType, setBrandFilterBusinessType] = useState('');
  const [selectedSido, setSelectedSido] = useState('');
  const [modalRightBrands, setModalRightBrands] = useState([]);
  const [modalRightLoading, setModalRightLoading] = useState(false);
  const [openFilterPanel, setOpenFilterPanel] = useState('');

  const filteredTalentList = useMemo(() => {
    if (!searchKeyword.trim()) return talentList;

    const keyword = searchKeyword.trim().toLowerCase();
    return talentList.filter((talent) => {
      return (
          String(talent.name ?? '').toLowerCase().includes(keyword) ||
          String(talent.location ?? '').toLowerCase().includes(keyword) ||
          String(talent.job ?? '').toLowerCase().includes(keyword) ||
          String(talent.experience ?? '').toLowerCase().includes(keyword)
      );
    });
  }, [talentList, searchKeyword]);

  const selectedBrandNames = useMemo(() => {
    const allBrands = [...modalRightBrands, ...BRAND_OPTIONS];
    const map = new Map(allBrands.map((b) => [b.id, b.name]));
    return selectedBrandIds.map((id) => ({ id, name: map.get(id) || `브랜드 ${id}` }));
  }, [selectedBrandIds, modalRightBrands]);

  // selected regions as objects { id, label }
  const selectedRegionNames = useMemo(() => {
    return regionOptions
        .filter((region) => selectedRegionIds.includes(Number(region.id)))
        .map((region) => ({ id: Number(region.id), label: `${region.sido ?? ''} ${region.sigungu ?? ''}`.trim() }))
        .filter((r) => r.label);
  }, [regionOptions, selectedRegionIds]);

  // selected business types as objects { type, label }
  const selectedBusinessLabels = useMemo(() => {
    return selectedBusinessTypes.map((type) => ({ type, label: BUSINESS_TYPE_LABELS[type] || type }));
  }, [selectedBusinessTypes]);

  const filteredBrandOptions = useMemo(() => {
    const keyword = brandKeyword.trim().toLowerCase();
    const biz = brandFilterBusinessType;
    // prefer server-provided modalRightBrands when biz selected
    let list = biz && modalRightBrands.length > 0 ? modalRightBrands : BRAND_OPTIONS;
    if (biz && modalRightBrands.length === 0 && modalRightLoading) {
      list = [];
    }
    if (!keyword) return list;
    return list.filter((brand) => (brand.name || '').toLowerCase().includes(keyword));
  }, [brandKeyword, brandFilterBusinessType, modalRightBrands, modalRightLoading]);

  async function loadModalRightBrands(biz) {
    if (!biz) {
      setModalRightBrands([]);
      return;
    }
    setModalRightLoading(true);
    try {
      const url = `${API_BASE}/api/brand/modal/right?businessType=${biz}`;
      const data = await fetchJsonWithFallback(url, []);
      const list = Array.isArray(data) ? data : [];
      const mapped = list.map((b) => ({ id: Number(b.brandId), name: b.brandName, businessType: biz }));
      setModalRightBrands(mapped);
    } catch {
      setModalRightBrands([]);
    } finally {
      setModalRightLoading(false);
    }
  }

  // Initial page bootstrapping only once on mount.
  useEffect(() => {
    loadPremiumTalents();
    loadTalentList('all');
    loadRegions();
  }, []);

  // when brand filter business type changes, load brands from backend
  useEffect(() => {
    if (openFilterPanel === 'brand') {
      loadModalRightBrands(brandFilterBusinessType);
    }
  }, [brandFilterBusinessType, openFilterPanel]);

  async function loadRegions() {
    try {
      const regions = await fetchJsonWithFallback(`${API_BASE}/api/regions`, []);
      setRegionOptions(Array.isArray(regions) ? regions : []);
    } catch {
      setRegionOptions([]);
    }
  }

  async function loadPremiumTalents() {
    setLoadingPremium(true);
    setError('');
    try {
      const data = await fetchJsonWithFallback(
          `${API_BASE}/human-resource/special?page=0`,
          { content: DUMMY_PREMIUM_TALENTS }
      );

      const items = Array.isArray(data) ? data : data.content ?? [];
      const mapped = items.map((item) =>
          item.resumeId || item.memberId || item.id ? mapResumeToTalent(item) : item
      );
      setPremiumTalents(mapped);
    } catch {
      setError('프리미엄 인재 목록을 불러오지 못했습니다.');
    } finally {
      setLoadingPremium(false);
    }
  }

  async function loadTalentList(type = selectedTab, filters = {}) {
    setLoadingList(true);
    setError('');
    setSelectedTab(type);

    const regionIds = filters.regionIds ?? selectedRegionIds;
    const businessTypes = filters.businessTypes ?? selectedBusinessTypes;
    const brandIds = filters.brandIds ?? selectedBrandIds;

    try {
      const requestUrls = [];

      if (type === 'all') {
        requestUrls.push(`${API_BASE}/human-resource?page=0`);
      } else if (type === 'active') {
        requestUrls.push(`${API_BASE}/human-resource/active?page=0`);
      } else if (type === 'special') {
        requestUrls.push(`${API_BASE}/human-resource/special?page=0`);
      } else if (type === 'brands' && brandIds.length > 0) {
        requestUrls.push(`${API_BASE}/human-resource/brands?brandIds=${brandIds.join(',')}&page=0`);
      } else if (type === 'brands' && brandIds.length === 0) {
        // No specific brands selected: show general human-resource list (fallback)
        requestUrls.push(`${API_BASE}/human-resource?page=0`);
      }

      if (regionIds.length > 0) {
        requestUrls.push(`${API_BASE}/human-resource/regions?regionIds=${regionIds.join(',')}&page=0`);
      }

      // NOTE:
      // backend /human-resource/business-types currently can return empty unexpectedly
      // (enum-string matching issue), so business type filtering is applied client-side
      // on the fetched candidate list.

      if (brandIds.length > 0 && type !== 'brands') {
        requestUrls.push(`${API_BASE}/human-resource/brands?brandIds=${brandIds.join(',')}&page=0`);
      }

      if (requestUrls.length === 0) {
        setTalentList([]);
        return;
      }

      const datasets = await Promise.all(
          requestUrls.map((url) => fetchResumeItems(url, { content: DUMMY_TALENT_LIST }))
      );

      let intersected = datasets[0] ?? [];
      for (let i = 1; i < datasets.length; i += 1) {
        const idSet = new Set((datasets[i] ?? []).map((item) => item.resumeId ?? item.id));
        intersected = intersected.filter((item) => idSet.has(item.resumeId ?? item.id));
      }

      const mapped = intersected.map((item) =>
          item.resumeId || item.memberId || item.id ? mapResumeToTalent(item) : item
      );

      const businessFiltered = businessTypes.length > 0
          ? mapped.filter((talent) => {
            const jobText = String(talent.job ?? '').toLowerCase();
            return businessTypes.some((type) => {
              const label = String(BUSINESS_TYPE_LABELS[type] || type).toLowerCase();
              return jobText.includes(label);
            });
          })
          : mapped;

      setTalentList(businessFiltered);
    } catch {
      setError('인재 목록을 불러오지 못했습니다.');
    } finally {
      setLoadingList(false);
    }
  }

  function handleSearchMove(tab = selectedTab) {
    setShowSearchPage(true);
    loadTalentList(tab);
  }

  function handleOpenTalentProfile(talent) {
    const resumeId = talent?.id;

    if (!resumeId) {
      setError('이력서 정보가 없어 프로필을 열 수 없습니다.');
      return;
    }

    navigate(`/talent-profile/${resumeId}`);
  }

  function updateAndReloadFilters(next = {}) {
    const nextRegions = next.regionIds ?? selectedRegionIds;
    const nextTypes = next.businessTypes ?? selectedBusinessTypes;
    const nextBrands = next.brandIds ?? selectedBrandIds;
    loadTalentList(selectedTab, {
      regionIds: nextRegions,
      businessTypes: nextTypes,
      brandIds: nextBrands,
    });
  }

  function toggleRegion(regionId) {
    const next = selectedRegionIds.includes(regionId)
        ? selectedRegionIds.filter((id) => id !== regionId)
        : [...selectedRegionIds, regionId];
    setSelectedRegionIds(next);
    updateAndReloadFilters({ regionIds: next });
  }

  function toggleBusinessType(type) {
    const next = selectedBusinessTypes.includes(type)
        ? selectedBusinessTypes.filter((v) => v !== type)
        : [...selectedBusinessTypes, type];
    setSelectedBusinessTypes(next);
    updateAndReloadFilters({ businessTypes: next });
  }

  function toggleBrand(brandId) {
    const next = selectedBrandIds.includes(brandId)
        ? selectedBrandIds.filter((id) => id !== brandId)
        : [...selectedBrandIds, brandId];
    setSelectedBrandIds(next);
    updateAndReloadFilters({ brandIds: next });
  }

  function handleResetFilters() {
    setSearchKeyword('');
    setSelectedRegionIds([]);
    setSelectedBusinessTypes([]);
    setSelectedBrandIds([]);
    setOpenFilterPanel('');
    loadTalentList(selectedTab, { regionIds: [], businessTypes: [], brandIds: [] });
  }

  function toggleFilterPanel(panel) {
    setOpenFilterPanel((prev) => (prev === panel ? '' : panel));
  }

  function removeRegionId(id) {
    const next = selectedRegionIds.filter((rid) => rid !== id);
    setSelectedRegionIds(next);
    updateAndReloadFilters({ regionIds: next });
  }

  function removeBusinessType(type) {
    const next = selectedBusinessTypes.filter((t) => t !== type);
    setSelectedBusinessTypes(next);
    updateAndReloadFilters({ businessTypes: next });
  }

  function removeBrandId(id) {
    const next = selectedBrandIds.filter((b) => b !== id);
    setSelectedBrandIds(next);
    updateAndReloadFilters({ brandIds: next });
  }

  return (
      <>
        <TopNavBar />

        {!showSearchPage ? (
            <main className="pt-32 pb-24 space-y-24">
              <section className="flex flex-col items-center space-y-10 py-10 custom-container">
                <h1 className="text-4xl font-extrabold tracking-tight text-on-surface text-center">
                  원하는 인재를 <span className="text-primary">지금 바로</span> 찾아보세요
                </h1>

                <div className="w-full max-w-4xl space-y-6">
                  <div className="relative group flex items-center">
                    <input
                        className="w-full h-16 pl-14 pr-32 bg-white border border-outline rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                        placeholder="희망업종, 지역 또는 이름으로 검색"
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSearchMove('all');
                        }}
                    />
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant text-2xl">
                  search
                </span>
                    <button
                        onClick={() => handleSearchMove('all')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-8 h-12 rounded-lg font-bold text-base hover:bg-primary-deep transition-colors shadow-sm"
                    >
                      검색
                    </button>
                  </div>

                  <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => handleSearchMove('all')}
                        className="px-6 py-2.5 rounded-full bg-primary text-white font-bold text-xs shadow-sm"
                    >
                      전체
                    </button>
                    <button
                        onClick={() => handleSearchMove('active')}
                        className="px-6 py-2.5 rounded-full bg-white border border-outline text-on-surface-variant font-bold text-xs hover:border-primary transition-colors"
                    >
                      실시간 활동
                    </button>
                    <button
                        onClick={() => handleSearchMove('special')}
                        className="px-6 py-2.5 rounded-full bg-white border border-outline text-on-surface-variant font-bold text-xs hover:border-primary transition-colors"
                    >
                      스페셜 인재
                    </button>
                    <button
                        onClick={() => {
                          setShowSearchPage(true);
                          setSelectedTab('brands');
                          loadTalentList('brands', { brandIds: selectedBrandIds });
                        }}
                        className="px-6 py-2.5 rounded-full bg-white border border-outline text-on-surface-variant font-bold text-xs hover:border-primary transition-colors"
                    >
                      브랜드 경력
                    </button>
                  </div>
                </div>
              </section>

              <section className="custom-container space-y-8">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tighter">오늘의 프리미엄 인재</h2>
                    <p className="text-on-surface-variant font-medium mt-2">
                      지금 즉시 업무 투입이 가능한 긴급 출근 대기 인재입니다.
                    </p>
                  </div>
                  <button
                      onClick={() => handleSearchMove('special')}
                      className="text-primary font-bold flex items-center gap-1 group py-2"
                  >
                    전체보기 <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {loadingPremium ? (
                      <div className="col-span-full text-center py-10">불러오는 중...</div>
                  ) : (
                      premiumTalents.map((talent) => (
                          <div
                              key={talent.id ?? talent.name}
                              className="bg-white rounded-xl p-6 border border-outline transition-all hover:shadow-md hover:-translate-y-1 relative cursor-pointer"
                              onClick={() => handleOpenTalentProfile(talent)}
                          >
                            <div className="absolute top-4 right-4">
                      <span className="bg-primary text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                        <span
                            className="material-symbols-outlined text-[12px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          bolt
                        </span>
                        로켓 출근
                      </span>
                            </div>
                            <div className="mb-5 h-20 w-20 rounded-xl overflow-hidden bg-gray-100">
                              <img alt={talent.name} className="w-full h-full object-cover" src={talent.image} />
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold">{talent.name}</span>
                                <div className="flex items-center gap-0.5 text-primary text-xs font-bold">
                          <span
                              className="material-symbols-outlined text-xs"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                                  {talent.rating}
                                </div>
                              </div>
                              <p className="text-on-surface-variant text-xs font-semibold">{talent.experience}</p>
                              <div className="pt-3 space-y-1">
                                <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium">
                                  <span className="material-symbols-outlined text-sm">location_on</span>
                                  {talent.location}
                                </div>
                                <div className="flex gap-1.5 mt-2">
                                  {(talent.tags ?? []).map((tag) => (
                                      <span
                                          key={tag}
                                          className="bg-gray-100 px-2 py-1 rounded text-[10px] font-semibold text-on-surface-variant"
                                      >
                              {tag}
                            </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                      ))
                  )}
                </div>
              </section>

              <section className="custom-container space-y-10">
                <div className="flex items-center justify-between border-b border-outline pb-4">
                  <h2 className="text-2xl font-extrabold tracking-tighter">
                    오늘의 인재 <span className="text-primary">{filteredTalentList.length}명</span>
                  </h2>
                  <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
                    <button className="text-on-surface border-b-2 border-primary pb-4 -mb-[18px]">최신순</button>
                    <button className="hover:text-on-surface pb-4">경력순</button>
                    <button className="hover:text-on-surface pb-4">별점순</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loadingList ? (
                      <div className="col-span-full text-center py-10">불러오는 중...</div>
                  ) : (
                      filteredTalentList.map((talent) => (
                          <div
                              key={talent.id ?? talent.name}
                              className="bg-white p-6 rounded-xl border border-outline flex flex-col gap-5 group cursor-pointer hover:shadow-md transition-all"
                              onClick={() => handleOpenTalentProfile(talent)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                <img alt={talent.name} className="w-full h-full object-cover" src={talent.image} />
                              </div>
                              <div className="flex items-center text-primary">
                        <span
                            className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                                <span className="text-sm font-bold ml-1">{talent.rating}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-bold">{talent.name}</h4>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        talent.status === '베테랑'
                                            ? 'bg-primary text-white'
                                            : 'bg-primary-soft text-primary'
                                    }`}
                                >
                          {talent.status}
                        </span>
                              </div>
                              <div className="space-y-1 text-xs text-on-surface-variant font-medium">
                                <p className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">location_on</span>
                                  {talent.location}
                                </p>
                                <p className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">work</span>
                                  {talent.job}
                                </p>
                                <p className="font-bold text-on-surface mt-1">{talent.experience}</p>
                              </div>
                              {talent.activeResponse && (
                                  <div className="flex items-center gap-1 text-primary text-[10px] font-extrabold">
                                    <span className="material-symbols-outlined text-sm">chat</span> 알바제의 적극응답
                                  </div>
                              )}
                            </div>
                            <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenTalentProfile(talent);
                                }}
                                className="w-full bg-gray-100 text-on-surface py-2.5 rounded-lg font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors"
                            >
                              프로필 열람
                            </button>
                          </div>
                      ))
                  )}
                </div>
              </section>
            </main>
        ) : (
            <main className="pt-28">
              <section className="pb-10">
                <div className="custom-container">
                  <div className="mb-6">
                    <button
                        onClick={() => setShowSearchPage(false)}
                        className="flex items-center gap-2 text-primary font-bold text-sm"
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                      돌아가기
                    </button>
                  </div>

                  <div className="flex flex-col gap-8">
                    <div className="flex gap-10 border-b border-outline overflow-x-auto scrollbar-hide">
                      <button
                          onClick={() => loadTalentList('all')}
                          className={`pb-4 text-lg font-bold border-b-4 whitespace-nowrap ${
                              selectedTab === 'all'
                                  ? 'border-primary text-on-surface'
                                  : 'border-transparent text-on-surface-variant hover:text-primary'
                          }`}
                      >
                        전체인재
                      </button>
                      <button
                          onClick={() => loadTalentList('active')}
                          className={`pb-4 text-lg font-bold border-b-4 whitespace-nowrap ${
                              selectedTab === 'active'
                                  ? 'border-primary text-on-surface'
                                  : 'border-transparent text-on-surface-variant hover:text-primary'
                          }`}
                      >
                        실시간 활동인재
                      </button>
                      <button
                          onClick={() => loadTalentList('special')}
                          className={`pb-4 text-lg font-bold border-b-4 whitespace-nowrap ${
                              selectedTab === 'special'
                                  ? 'border-primary text-on-surface'
                                  : 'border-transparent text-on-surface-variant hover:text-primary'
                          }`}
                      >
                        스페셜 인재
                      </button>
                      <button
                          onClick={() => loadTalentList('brands', { brandIds: selectedBrandIds })}
                          className={`pb-4 text-lg font-bold border-b-4 whitespace-nowrap ${
                              selectedTab === 'brands'
                                  ? 'border-primary text-on-surface'
                                  : 'border-transparent text-on-surface-variant hover:text-primary'
                          }`}
                      >
                        브랜드 경력 인재
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex-grow flex items-center bg-white border border-outline rounded-xl px-4 py-2 shadow-sm focus-within:border-primary transition-colors">
                        <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
                        <input
                            className="w-full border-none focus:ring-0 text-sm font-medium"
                            placeholder="지역, 업종, 또는 인재명을 입력하세요"
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') loadTalentList(selectedTab);
                            }}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => toggleFilterPanel('region')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                                selectedRegionIds.length > 0
                                    ? 'bg-primary-soft text-primary border border-primary/20'
                                    : 'bg-[#f2efee] hover:bg-gray-200'
                            }`}
                        >
                          지역별 <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                        </button>

                        <button
                            onClick={() => toggleFilterPanel('business')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                                selectedBusinessTypes.length > 0
                                    ? 'bg-primary-soft text-primary border border-primary/20'
                                    : 'bg-[#f2efee] hover:bg-gray-200'
                            }`}
                        >
                          업종별 <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                        </button>

                        <button
                            onClick={() => toggleFilterPanel('brand')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                                selectedBrandIds.length > 0
                                    ? 'bg-primary-soft text-primary border border-primary/20'
                                    : 'bg-[#f2efee] hover:bg-gray-200'
                            }`}
                        >
                          브랜드별 <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 bg-[#f2efee] rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">
                          리뷰 점수별 <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                        </button>

                        <button
                            onClick={handleResetFilters}
                            className="flex items-center gap-1 px-4 py-2 text-primary text-xs font-bold ml-2"
                        >
                          <span className="material-symbols-outlined text-sm">restart_alt</span> 필터 초기화
                        </button>
                      </div>
                    </div>

                    {openFilterPanel === 'region' && (
                        <div className="p-4 bg-white border border-outline rounded-xl">
                          <div className="flex gap-4">
                            <div className="w-1/3 border-r border-outline pr-3">
                              <div className="text-xs font-semibold text-on-surface-variant mb-2">시/도</div>
                              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                                {Array.from(new Set(regionOptions.map((r) => r.sido).filter(Boolean))).map((sido) => (
                                    <button
                                        key={sido}
                                        type="button"
                                        onClick={() => setSelectedSido(sido)}
                                        className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                                            selectedSido === sido ? 'bg-primary-soft text-primary' : 'bg-white text-on-surface-variant'
                                        }`}
                                    >
                                      {sido}
                                    </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="text-xs font-semibold text-on-surface-variant mb-2">시/군/구</div>
                              <div className="max-h-60 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-2">
                                {selectedSido ? (
                                    regionOptions
                                        .filter((r) => r.sido === selectedSido)
                                        .map((region) => {
                                          const regionId = Number(region.id);
                                          const checked = selectedRegionIds.includes(regionId);
                                          const label = `${region.sigungu ?? ''}`.trim();

                                          return (
                                              <button
                                                  key={regionId}
                                                  type="button"
                                                  onClick={() => toggleRegion(regionId)}
                                                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left ${
                                                      checked
                                                          ? 'bg-primary-soft text-primary border-primary/30'
                                                          : 'bg-white border-outline text-on-surface-variant'
                                                  }`}
                                              >
                                                {label || `지역 ${regionId}`}
                                              </button>
                                          );
                                        })
                                ) : (
                                    <div className="text-on-surface-variant text-sm">왼쪽에서 시/도를 먼저 선택하세요.</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                    )}

                    {openFilterPanel === 'business' && (
                        <div className="p-4 bg-white border border-outline rounded-xl">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(BUSINESS_TYPE_LABELS).map(([value, label]) => {
                              const checked = selectedBusinessTypes.includes(value);
                              return (
                                  <button
                                      key={value}
                                      type="button"
                                      onClick={() => toggleBusinessType(value)}
                                      className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                                          checked
                                              ? 'bg-primary-soft border-primary text-primary'
                                              : 'bg-white border-outline text-on-surface-variant'
                                      }`}
                                  >
                                    {label}
                                  </button>
                              );
                            })}
                          </div>
                        </div>
                    )}

                    {openFilterPanel === 'brand' && (
                        <div className="p-4 bg-white border border-outline rounded-xl space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setBrandFilterBusinessType('')}
                                className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                                    brandFilterBusinessType === '' ? 'bg-primary-soft border-primary text-primary' : 'bg-white border-outline text-on-surface-variant'
                                }`}
                            >
                              전체
                            </button>
                            {Object.entries(BUSINESS_TYPE_LABELS).map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setBrandFilterBusinessType(value)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                                        brandFilterBusinessType === value ? 'bg-primary-soft border-primary text-primary' : 'bg-white border-outline text-on-surface-variant'
                                    }`}
                                >
                                  {label}
                                </button>
                            ))}
                          </div>
                          <input
                              type="text"
                              value={brandKeyword}
                              onChange={(e) => setBrandKeyword(e.target.value)}
                              placeholder="브랜드명 검색"
                              className="w-full bg-white border border-outline rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                          />
                          <div className="max-h-60 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-2">
                            {filteredBrandOptions.map((brand) => {
                              const checked = selectedBrandIds.includes(brand.id);
                              return (
                                  <button
                                      key={brand.id}
                                      type="button"
                                      onClick={() => toggleBrand(brand.id)}
                                      className={`px-3 py-2 rounded-lg text-xs font-bold border text-left ${
                                          checked
                                              ? 'bg-primary-soft border-primary text-primary'
                                              : 'bg-white border-outline text-on-surface-variant'
                                      }`}
                                  >
                                    {brand.name}
                                  </button>
                              );
                            })}
                          </div>
                        </div>
                    )}

                    {(selectedRegionNames.length > 0 || selectedBusinessLabels.length > 0 || selectedBrandNames.length > 0) && (
                        <div className="flex flex-wrap gap-2">
                          {selectedRegionNames.map((r) => (
                              <span key={`region-${r.id}`} className="bg-gray-100 text-on-surface-variant text-xs font-bold px-2 py-1 rounded-full flex items-center gap-2">
                                <span>{r.label}</span>
                                <button onClick={() => removeRegionId(r.id)} className="text-[11px] px-1 rounded-full hover:bg-gray-200">×</button>
                              </span>
                          ))}
                          {selectedBusinessLabels.map((b) => (
                              <span key={`type-${b.type}`} className="bg-gray-100 text-on-surface-variant text-xs font-bold px-2 py-1 rounded-full flex items-center gap-2">
                                <span>{b.label}</span>
                                <button onClick={() => removeBusinessType(b.type)} className="text-[11px] px-1 rounded-full hover:bg-gray-200">×</button>
                              </span>
                          ))}
                          {selectedBrandNames.map((br) => (
                              <span key={`brand-${br.id}`} className="bg-primary-soft text-primary text-xs font-bold px-2 py-1 rounded-full flex items-center gap-2">
                                <span>{br.name}</span>
                                <button onClick={() => removeBrandId(br.id)} className="text-[11px] px-1 rounded-full hover:bg-primary/20">×</button>
                              </span>
                          ))}
                        </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="bg-white py-10">
                <div className="custom-container">
                  <div className="flex items-end justify-between mb-8">
                    <h3 className="text-2xl font-extrabold tracking-tighter">
                      대기중인 인재 <span className="text-primary">{filteredTalentList.length}명</span>
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
                      <button className="text-on-surface">최신순</button>
                      <span className="text-outline">|</span>
                      <button className="hover:text-on-surface">별점순</button>
                      <span className="text-outline">|</span>
                      <button className="hover:text-on-surface">경력순</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loadingList ? (
                        <div className="col-span-full text-center py-10">불러오는 중...</div>
                    ) : (
                        filteredTalentList.map((talent) => (
                            <div
                                key={`search-${talent.id ?? talent.name}`}
                                className="bg-white rounded-xl p-6 border border-outline transition-all hover:shadow-lg hover:-translate-y-1 relative group cursor-pointer"
                                onClick={() => handleOpenTalentProfile(talent)}
                            >
                              <div className="mb-5 h-20 w-20 rounded-xl overflow-hidden bg-gray-100">
                                <img alt={talent.name} className="w-full h-full object-cover" src={talent.image} />
                              </div>
                              <div className="space-y-1.5 mb-6">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold">{talent.name}</span>
                                  <div className="flex items-center gap-0.5 text-primary text-xs font-bold">
                            <span
                                className="material-symbols-outlined text-xs"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                                    {talent.rating}
                                  </div>
                                </div>
                                <p className="text-on-surface-variant text-xs font-semibold">{talent.experience}</p>
                                <div className="pt-3 space-y-1">
                                  <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    {talent.location}
                                  </div>
                                </div>
                              </div>
                              <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenTalentProfile(talent);
                                  }}
                                  className="w-full py-3 bg-gray-50 text-on-surface font-bold rounded-lg group-hover:bg-primary group-hover:text-white transition-colors text-sm"
                              >
                                프로필 열람
                              </button>
                            </div>
                        ))
                    )}
                  </div>
                </div>
              </section>
            </main>
        )}

        <AppFooter />

        <div className={`${showLoginModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
          <div
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
              onClick={() => setShowLoginModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md p-10 rounded-2xl flex flex-col items-center text-center shadow-2xl">
            <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mb-6">
            <span
                className="material-symbols-outlined text-primary text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
            </div>
            <h5 className="text-2xl font-bold mb-3">기업회원 전용 메뉴입니다</h5>
            <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
              상세한 인재 프로필 정보 열람과
              <br />
              알바 제의는 기업회원 로그인 후 가능합니다.
            </p>
            <div className="w-full flex flex-col gap-3">
              <CommonButton size="full">기업회원 로그인</CommonButton>
              <CommonButton variant="subtle" size="full">
                기업회원 가입하기
              </CommonButton>
            </div>
            <button
                className="mt-6 text-on-surface-variant text-sm font-bold underline decoration-outline underline-offset-4"
                onClick={() => setShowLoginModal(false)}
            >
              닫기
            </button>
          </div>
        </div>

        {error && (
            <div className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-[120]">
              {error}
            </div>
        )}
      </>
  );
}

