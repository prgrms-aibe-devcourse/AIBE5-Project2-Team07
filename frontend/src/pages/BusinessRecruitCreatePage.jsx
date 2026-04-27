import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBarLoggedIn from '../components/TopNavBarLoggedIn';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import AddressSearchField from '../components/AddressSearchField';
import BusinessSidebar from '../components/business-mypage/BusinessSidebar';
import {
  createMyBusinessRecruit,
  getMyBusinessAccountMe,
  getMyBusinessAccountSummary,
} from '../services/accountApi';
import { uploadBusinessResumeFile } from '../services/fileApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const WORK_PERIOD_OPTIONS = [
  { value: 'OneDay', label: '하루' },
  { value: 'OneWeek', label: '1주 이하' },
  { value: 'OneMonth', label: '1개월 이하' },
  { value: 'ThreeMonths', label: '3개월 이하' },
  { value: 'SixMonths', label: '6개월 이하' },
  { value: 'OneYear', label: '1년 이하' },
  { value: 'MoreThanOneYear', label: '1년 이상' },
];

const WORK_TIME_OPTIONS = [
  { value: 'MORNING', label: '오전' },
  { value: 'AFTERNOON', label: '오후' },
  { value: 'EVENING', label: '저녁' },
  { value: 'NIGHT', label: '새벽' },
  { value: 'MORNING_AFTERNOON', label: '오전~오후' },
  { value: 'AFTERNOON_EVENING', label: '오후~저녁' },
  { value: 'EVENING_NIGHT', label: '저녁~새벽' },
  { value: 'NIGHT_MORNING', label: '새벽~오전' },
  { value: 'FULLTIME', label: '풀타임' },
];

const BUSINESS_TYPE_OPTIONS = [
  { value: 'FOOD_RESTAURANT', label: '외식(음식점)' },
  { value: 'CAFE', label: '카페' },
  { value: 'RETAIL_STORE', label: '매장관리/판매' },
  { value: 'SERVICE', label: '서비스' },
  { value: 'DELIVERY_DRIVER', label: '운전/배달' },
  { value: 'MANUAL_LABOR', label: '현장단순노무' },
];

const SALARY_TYPE_OPTIONS = [
  { value: 'HOURLY', label: '시급' },
  { value: 'MONTHLY', label: '월급' },
];

const WORK_DAYS = [
  { value: 'MON', label: '월' },
  { value: 'TUE', label: '화' },
  { value: 'WED', label: '수' },
  { value: 'THU', label: '목' },
  { value: 'FRI', label: '금' },
  { value: 'SAT', label: '토' },
  { value: 'SUN', label: '일' },
];

const APPLICATION_METHOD_OPTIONS = [
  { value: 'ONLINE', label: '온라인 지원' },
  { value: 'EMAIL', label: '이메일 지원' },
];

const DEFAULT_RECRUIT_TEMPLATE = [
  '근무기간: ',
  '근무시간: ',
  '근무요일: ',
  '복리후생: ',
].join('\n');

function toDateOnly(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

function isUrgentDeadline(deadline) {
  const target = toDateOnly(deadline);
  if (!target) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 && diff <= 3;
}

function isPastDate(deadline) {
  const target = toDateOnly(deadline);
  if (!target) return false;
  const today = toDateOnly(new Date());
  return target < today;
}

function normalizeRegionText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeSidoName(value) {
  const normalized = normalizeRegionText(value);

  const aliasMap = {
    '서울': '서울특별시',
    '서울시': '서울특별시',
    '부산': '부산광역시',
    '부산시': '부산광역시',
    '대구': '대구광역시',
    '대구시': '대구광역시',
    '인천': '인천광역시',
    '인천시': '인천광역시',
    '광주': '광주광역시',
    '광주시': '광주광역시',
    '대전': '대전광역시',
    '대전시': '대전광역시',
    '울산': '울산광역시',
    '울산시': '울산광역시',
    '세종': '세종특별자치시',
    '세종시': '세종특별자치시',
    '경기': '경기도',
    '강원': '강원특별자치도',
    '강원도': '강원특별자치도',
    '충북': '충청북도',
    '충남': '충청남도',
    '전북': '전북특별자치도',
    '전라북도': '전북특별자치도',
    '전남': '전라남도',
    '경북': '경상북도',
    '경남': '경상남도',
    '제주': '제주특별자치도',
    '제주도': '제주특별자치도',
  };

  return aliasMap[normalized] || normalized;
}

function getSidoAliases(value) {
  const canonical = normalizeSidoName(value);
  const shortAliasMap = {
    '서울특별시': '서울',
    '부산광역시': '부산',
    '대구광역시': '대구',
    '인천광역시': '인천',
    '광주광역시': '광주',
    '대전광역시': '대전',
    '울산광역시': '울산',
    '세종특별자치시': '세종',
    '경기도': '경기',
    '강원특별자치도': '강원',
    '충청북도': '충북',
    '충청남도': '충남',
    '전북특별자치도': '전북',
    '전라남도': '전남',
    '경상북도': '경북',
    '경상남도': '경남',
    '제주특별자치도': '제주',
  };

  return [canonical, shortAliasMap[canonical]].filter(Boolean);
}

function extractAddressTokens(address = '') {
  const normalizedAddress = normalizeRegionText(address)
    .replace(/\([^)]*\)/g, '')
    .trim();

  if (!normalizedAddress) {
    return { normalizedAddress: '', parsedSido: '', parsedSigungu: '' };
  }

  const tokens = normalizedAddress.split(' ').filter(Boolean);
  const parsedSido = tokens[0] || '';

  let parsedSigungu = tokens[1] || '';
  if (tokens.length >= 3 && /(시|군)$/u.test(tokens[1]) && /(구)$/u.test(tokens[2])) {
    parsedSigungu = `${tokens[1]} ${tokens[2]}`;
  }

  return { normalizedAddress, parsedSido, parsedSigungu };
}

function findRegionId(regionOptions, sido, sigungu, address = '') {
  if (!Array.isArray(regionOptions) || regionOptions.length === 0) return null;
  const { normalizedAddress, parsedSido, parsedSigungu } = extractAddressTokens(address);
  const normalizedSido = normalizeSidoName(sido || parsedSido);
  const normalizedSigungu = normalizeRegionText(sigungu || parsedSigungu);
  if (!normalizedSido) return null;

  const sameSidoRegions = regionOptions.filter((region) => normalizeSidoName(region?.sido) === normalizedSido);
  if (sameSidoRegions.length === 0) return null;

  const exactMatched = normalizedSigungu
    ? sameSidoRegions.find((region) => normalizeRegionText(region?.sigungu) === normalizedSigungu)
    : null;
  if (exactMatched?.id != null) return exactMatched.id;

  if (normalizedAddress) {
    const prefixMatched = [...sameSidoRegions]
      .sort((a, b) => normalizeRegionText(b?.sigungu).length - normalizeRegionText(a?.sigungu).length)
      .find((region) => getSidoAliases(region?.sido).some((sidoAlias) => {
        const regionPrefix = `${normalizeRegionText(sidoAlias)} ${normalizeRegionText(region?.sigungu)}`.trim();
        return normalizedAddress.startsWith(regionPrefix);
      }));

    if (prefixMatched?.id != null) return prefixMatched.id;
  }

  if (normalizedSigungu) {
    const partialMatched = sameSidoRegions.find((region) => {
      const regionSigungu = normalizeRegionText(region?.sigungu);
      return regionSigungu.includes(normalizedSigungu) || normalizedSigungu.includes(regionSigungu);
    });

    if (partialMatched?.id != null) return partialMatched.id;
  }

  return null;
}

function BusinessRecruitCreatePage() {
  const navigate = useNavigate();

  const [companySummary, setCompanySummary] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState('');
  const [regionOptions, setRegionOptions] = useState([]);
  const [recruitFile, setRecruitFile] = useState(null);
  const [recruitFilePreviewName, setRecruitFilePreviewName] = useState('');

  const [form, setForm] = useState({
    urgent: false,
    title: '',
    businessType: 'FOOD_RESTAURANT',
    recruitCount: '1',
    workPeriod: 'OneDay',
    workDays: [],
    workTime: 'MORNING',
    payType: 'HOURLY',
    payAmount: '',
    workplacePostalCode: '',
    workplaceAddress: '',
    workplaceAddressDetail: '',
    workplaceSido: '',
    workplaceSigungu: '',
    regionId: null,
    deadline: '',
    applicationMethods: ['ONLINE'],
    applyContact: '',
    description: DEFAULT_RECRUIT_TEMPLATE,
  });

  useEffect(() => {
    let mounted = true;

    const resolveBrandLogoUrl = async (brandId) => {
      if (brandId == null) return '';
      try {
        const response = await fetch(`/api/brand/${encodeURIComponent(brandId)}/summary`);
        if (!response.ok) return '';
        const result = await response.json();
        return result?.logoImg || '';
      } catch {
        return '';
      }
    };

    const loadSummary = async () => {
      try {
        const [summary, me] = await Promise.all([
          getMyBusinessAccountSummary(),
          getMyBusinessAccountMe(),
        ]);
        const brandLogoUrl = await resolveBrandLogoUrl(me?.brandId);
        if (mounted) {
          setCompanySummary({
            ...summary,
            brandId: me?.brandId ?? null,
            brandLogoUrl,
            companyImageUrl: me?.companyImageUrl || summary?.companyImageUrl || '',
          });
        }
      } catch {
        if (mounted) setCompanySummary(null);
      }
    };
    loadSummary();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadRegions = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/regions`, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`지역 목록 조회 실패 (${response.status})`);
        }

        const result = await response.json();
        if (!mounted) return;
        setRegionOptions(Array.isArray(result) ? result : []);
      } catch (regionError) {
        if (!mounted) return;
        setRegionOptions([]);
        console.error(regionError);
      }
    };

    loadRegions();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!form.workplaceSido || !form.workplaceSigungu) return;

    const nextRegionId = findRegionId(
      regionOptions,
      form.workplaceSido,
      form.workplaceSigungu,
      form.workplaceAddress,
    );
    setForm((prev) => (
      prev.regionId === nextRegionId
        ? prev
        : { ...prev, regionId: nextRegionId }
    ));
  }, [form.workplaceSido, form.workplaceSigungu, form.workplaceAddress, regionOptions]);

  const urgentDeadlineValid = useMemo(() => isUrgentDeadline(form.deadline), [form.deadline]);

  const isOneDayRecruit = useMemo(() => form.workPeriod === 'OneDay', [form.workPeriod]);

  useEffect(() => {
    if (form.urgent && form.deadline && !urgentDeadlineValid) {
      setForm((prev) => ({ ...prev, urgent: false }));
      window.alert('긴급 공고는 오늘 기준 3일 이내 마감일일 때만 설정할 수 있습니다.');
    }
  }, [form.urgent, form.deadline, urgentDeadlineValid]);

  useEffect(() => {
    if (!isOneDayRecruit) return;
    setForm((prev) => ({
      ...prev,
      payType: 'HOURLY',
      workDays: prev.workDays.length > 1 ? [prev.workDays[0]] : prev.workDays,
    }));
  }, [isOneDayRecruit]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'recruitCount' || name === 'payAmount') {
      const digitsOnly = String(value || '').replace(/[^\d]/g, '');
      setForm((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    if (name === 'workPeriod') {
      setForm((prev) => ({
        ...prev,
        workPeriod: value,
        payType: value === 'OneDay' ? 'HOURLY' : prev.payType,
        workDays: value === 'OneDay' && prev.workDays.length > 1 ? [prev.workDays[0]] : prev.workDays,
      }));
      return;
    }

    if (name === 'payType' && form.workPeriod === 'OneDay') {
      setForm((prev) => ({ ...prev, payType: 'HOURLY' }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleUrgent = () => {
    if (!form.urgent && !urgentDeadlineValid) {
      window.alert('긴급 공고는 마감일을 오늘 기준 3일 이내로 선택한 경우에만 체크할 수 있습니다.');
      return;
    }
    setForm((prev) => ({ ...prev, urgent: !prev.urgent }));
  };

  const toggleWorkDay = (day) => {
    setForm((prev) => ({
      ...prev,
      workDays: prev.workPeriod === 'OneDay'
        ? (prev.workDays.includes(day) ? [] : [day])
        : (prev.workDays.includes(day)
          ? prev.workDays.filter((item) => item !== day)
          : [...prev.workDays, day]),
    }));
  };

  const toggleApplicationMethod = (value) => {
    if (value === 'ONLINE') return;
    setForm((prev) => {
      const has = prev.applicationMethods.includes(value);
      const next = has
        ? prev.applicationMethods.filter((item) => item !== value)
        : [...prev.applicationMethods, value];
      return {
        ...prev,
        applicationMethods: ['ONLINE', ...next.filter((item) => item !== 'ONLINE')],
        applyContact: has ? '' : prev.applyContact,
      };
    });
  };

  const handleWorkplaceAddressSelect = ({ zonecode, address, sido, sigungu }) => {
    const nextRegionId = findRegionId(regionOptions, sido, sigungu, address);
    setForm((prev) => ({
      ...prev,
      workplacePostalCode: zonecode,
      workplaceAddress: address,
      workplaceAddressDetail: '',
      workplaceSido: sido || '',
      workplaceSigungu: sigungu || '',
      regionId: nextRegionId,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('공고 제목을 입력해주세요.');
      return;
    }
    if (!form.deadline) {
      setError('마감일을 선택해주세요.');
      return;
    }
    if (isPastDate(form.deadline)) {
      setError('마감일은 오늘보다 이전일 수 없습니다.');
      return;
    }
    if (form.urgent && !urgentDeadlineValid) {
      setError('긴급 공고는 마감일이 3일 이내여야 합니다.');
      return;
    }
    if (!form.payAmount || !/^\d+$/.test(form.payAmount) || Number(form.payAmount) <= 0) {
      setError('급여 금액을 올바르게 입력해주세요.');
      return;
    }
    if (form.recruitCount !== '' && (!/^\d+$/.test(form.recruitCount) || Number(form.recruitCount) < 0)) {
      setError('모집인원은 0 이상의 숫자만 입력할 수 있습니다.');
      return;
    }
    if (form.workPeriod === 'OneDay' && form.workDays.length !== 1) {
      setError('단기(하루) 공고는 근무요일을 1개만 선택할 수 있습니다.');
      return;
    }
    if (form.workPeriod === 'OneDay' && form.payType !== 'HOURLY') {
      setError('단기(하루) 공고의 급여 기준은 시급만 가능합니다.');
      return;
    }
    if (!form.workDays.length) {
      setError('근무요일을 1개 이상 선택해주세요.');
      return;
    }
    if (!form.workplaceAddress.trim()) {
      setError('근무지 주소를 선택해주세요.');
      return;
    }
    const resolvedRegionId = form.regionId || findRegionId(
      regionOptions,
      form.workplaceSido,
      form.workplaceSigungu,
      form.workplaceAddress,
    );

    if (!resolvedRegionId) {
      setError('근무지 지역 정보를 확인하지 못했습니다. 주소를 다시 선택해주세요.');
      return;
    }

    const methodText = form.applicationMethods
      .map((item) => (item === 'ONLINE' ? '온라인 지원' : '이메일 지원'))
      .join(', ');

    const descriptionParts = [
      form.description?.trim(),
      `[접수방법] ${methodText}`,
      form.applyContact?.trim() ? `[지원 연락처/링크] ${form.applyContact.trim()}` : '',
    ].filter(Boolean);

    const payload = {
      title: form.title.trim(),
      brandId: companySummary?.brandId ?? null,
      isUrgent: Boolean(form.urgent),
      urgent: Boolean(form.urgent),
      deadline: form.deadline,
      salary: Number(form.payAmount),
      salaryType: form.workPeriod === 'OneDay' ? 'HOURLY' : form.payType,
      headCount: form.recruitCount === '' ? null : (Number(form.recruitCount) === 0 ? null : Number(form.recruitCount)),
      regionId: Number(resolvedRegionId),
      detailAddress: [form.workplaceAddress, form.workplaceAddressDetail].filter(Boolean).join(' ').trim() || null,
      workPeriod: [form.workPeriod],
      workDays: form.workDays,
      workTime: [form.workTime],
      businessType: [form.businessType],
      description: descriptionParts.join('\n'),
      resumeFormUrl: form.applyContact?.trim() || null,
    };

    const ok = window.confirm('입력한 내용으로 공고를 등록할까요?');
    if (!ok) return;

    try {
      setLoadingSubmit(true);

      let uploadedResumeFormUrl = form.applyContact?.trim() || null;
      if (recruitFile) {
        const uploaded = await uploadBusinessResumeFile(recruitFile);
        uploadedResumeFormUrl = uploaded?.url || uploadedResumeFormUrl;
      }

      await createMyBusinessRecruit({ ...payload, resumeFormUrl: uploadedResumeFormUrl });
      window.alert('공고가 등록되었습니다.');
      navigate('/dashboard?tab=recruits');
    } catch (submitError) {
      setError(submitError?.message || '공고 등록에 실패했습니다.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-on-surface">
      <TopNavBarLoggedIn />

      <div className="pt-20 min-h-screen">
        <div className="custom-container py-8 flex flex-col lg:flex-row gap-8">
          <BusinessSidebar
            activeTab="recruits"
            onChangeTab={(tabId) => navigate(`/dashboard?tab=${tabId}`)}
            navigate={navigate}
            companySummary={companySummary}
          />

          <main className="flex-1 min-w-0">
            <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-3xl font-black tracking-tight">공고 등록</h1>
                <p className="text-sm text-on-surface-variant mt-1">필수 항목을 입력한 뒤 등록을 눌러주세요.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard?tab=recruits')}
                className="self-start md:self-auto px-4 py-2 rounded-lg border border-outline bg-white text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                공고 관리로 돌아가기
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormSection title="모집 내용">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Field label="공고 제목" name="title" value={form.title} onChange={handleChange} required />
                  </div>
                  <SelectField label="업직종" name="businessType" value={form.businessType} onChange={handleChange} options={BUSINESS_TYPE_OPTIONS} required />
                  <Field
                    label="모집인원"
                    name="recruitCount"
                    value={form.recruitCount}
                    onChange={handleChange}
                    type="text"
                    inputMode="numeric"
                    disallowScientific
                    required
                  />
                  <div className="md:col-span-2">
                    <label className="block">
                      <span className="text-xs font-bold text-on-surface-variant mb-2 block">모집 요강</span>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-xl border border-outline bg-white px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
                      />
                    </label>
                  </div>
                </div>
              </FormSection>

              <FormSection title="근무 조건">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField label="근무기간" name="workPeriod" value={form.workPeriod} onChange={handleChange} options={WORK_PERIOD_OPTIONS} required />
                  <SelectField label="근무시간" name="workTime" value={form.workTime} onChange={handleChange} options={WORK_TIME_OPTIONS} required />
                  <SelectField
                    label="급여 기준"
                    name="payType"
                    value={form.payType}
                    onChange={handleChange}
                    options={SALARY_TYPE_OPTIONS}
                    required
                    disabled={isOneDayRecruit}
                    helperText={isOneDayRecruit ? '단기(하루) 공고는 시급으로 고정됩니다.' : ''}
                  />
                  <Field label="급여 금액(원)" name="payAmount" value={form.payAmount} onChange={handleChange} type="text" inputMode="numeric" disallowScientific required />
                  <div className="md:col-span-2">
                    <span className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">근무요일 <Required /></span>
                    {isOneDayRecruit && (
                      <p className="text-[11px] text-primary font-semibold mb-2">단기(하루) 공고는 근무요일 1개만 선택할 수 있습니다.</p>
                    )}
                    <div className="rounded-xl border border-outline p-3">
                      <div className="flex flex-wrap gap-2">
                      {WORK_DAYS.map(({ value, label }) => {
                        const active = form.workDays.includes(value);
                        return (
                          <CommonButton
                            key={value}
                            type="button"
                            onClick={() => toggleWorkDay(value)}
                            variant="toggle"
                            size="square"
                            active={active}
                            activeClassName="bg-primary text-white border-primary"
                            inactiveClassName="bg-white text-on-surface-variant border-outline hover:bg-gray-50"
                            className="rounded-xl border"
                          >
                            {label}
                          </CommonButton>
                        );
                      })}
                      </div>
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="근무지/접수 정보">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-4 items-end">
                    <label className="block">
                      <span className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">마감일 <Required /></span>
                      <input
                        name="deadline"
                        type="date"
                        value={form.deadline}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      />
                    </label>
                    <div className={`rounded-2xl border p-4 ${form.urgent ? 'bg-red-50 border-red-200' : 'bg-white border-outline'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-sm">긴급 공고</p>
                          <p className="text-xs text-on-surface-variant mt-0.5 break-keep">
                            마감일이 오늘 기준 3일 이내일 때만 설정할 수 있습니다.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={toggleUrgent}
                          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold border ${form.urgent ? 'bg-red-500 text-white border-red-500' : 'bg-white text-on-surface-variant border-outline'}`}
                        >
                          {form.urgent ? '사용 중' : '사용'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <AddressSearchField
                      label="근무지 주소"
                      addressName="workplaceAddress"
                      detailName="workplaceAddressDetail"
                      addressValue={form.workplaceAddress}
                      detailValue={form.workplaceAddressDetail}
                      onChange={(event) => {
                        const { name, value } = event.target;
                        setForm((prev) => ({ ...prev, [name]: value }));
                      }}
                      onAddressSelect={handleWorkplaceAddressSelect}
                      required
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-on-surface-variant mb-2 block">접수 방법</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl border text-xs font-bold bg-primary-soft text-primary border-primary/30 cursor-default"
                      >
                        온라인 지원 (기본)
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleApplicationMethod('EMAIL')}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold ${form.applicationMethods.includes('EMAIL') ? 'bg-primary-soft text-primary border-primary/30' : 'bg-white border-outline text-on-surface-variant'}`}
                      >
                        이메일 지원
                      </button>
                    </div>
                  </div>

                  {form.applicationMethods.includes('EMAIL') && (
                    <Field
                      label="이메일 지원 연락처/링크"
                      name="applyContact"
                      value={form.applyContact}
                      onChange={handleChange}
                      placeholder="이메일/연락처 입력"
                    />
                  )}

                  <div className="md:col-span-2">
                    <span className="text-xs font-bold text-on-surface-variant mb-2 block">지원 양식 첨부파일 <span className="font-normal text-gray-400">(선택)</span></span>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-4 py-2 rounded-xl border border-outline bg-white text-sm font-bold text-on-surface-variant hover:bg-gray-50 transition-colors">
                        파일 선택
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (!file) { setRecruitFile(null); setRecruitFilePreviewName(''); return; }
                            const isAllowed = /\.(pdf|doc|docx)$/i.test(file.name);
                            if (!isAllowed) { setError('파일은 PDF, DOC, DOCX 형식만 업로드할 수 있습니다.'); e.target.value = ''; return; }
                            setRecruitFile(file);
                            setRecruitFilePreviewName(file.name);
                          }}
                        />
                      </label>
                      {recruitFilePreviewName ? (
                        <span className="text-sm text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-blue-600">attach_file</span>
                          {recruitFilePreviewName}
                          <button type="button" onClick={() => { setRecruitFile(null); setRecruitFilePreviewName(''); }} className="ml-1 text-gray-400 hover:text-red-500 text-xs">✕</button>
                        </span>
                      ) : (
                        <span className="text-sm text-on-surface-variant">선택된 파일 없음</span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-on-surface-variant">지원자에게 제공할 이력서 양식 또는 첨부파일을 업로드할 수 있습니다. (PDF, DOC, DOCX)</p>
                  </div>
                </div>
              </FormSection>

              <div className="flex flex-col sm:flex-row gap-3 justify-end pb-6">
                {error && (
                  <div className="w-full sm:mr-auto sm:max-w-xl bg-red-50 border border-red-200 rounded-2xl p-4 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}
                <CommonButton type="button" variant="outline" size="sm" onClick={() => navigate('/dashboard?tab=recruits')}>
                  취소
                </CommonButton>
                <CommonButton type="submit" size="sm" disabled={loadingSubmit}>
                  {loadingSubmit ? '등록 중...' : '등록하기'}
                </CommonButton>
              </div>
            </form>
          </main>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}

function Required() {
  return <span className="text-red-500">*</span>;
}

function FormSection({ title, children }) {
  return (
    <section className="bg-white border border-outline rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-5">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, name, value, onChange, type = 'text', placeholder = '', required = false, inputMode, disallowScientific = false }) {
  const handleKeyDown = (event) => {
    if (!disallowScientific) return;
    if (['e', 'E', '+', '-', '.'].includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <label className="block">
      <span className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">
        {label} {required && <Required />}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        inputMode={inputMode}
        placeholder={placeholder}
        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
      />
    </label>
  );
}

function SelectField({ label, name, value, onChange, options, required = false, disabled = false, helperText = '' }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">
        {label} {required && <Required />}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none ${disabled ? 'text-on-surface-variant bg-gray-50 cursor-not-allowed' : ''}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {helperText ? <p className="mt-1 text-[11px] text-on-surface-variant">{helperText}</p> : null}
    </label>
  );
}

export default BusinessRecruitCreatePage;

