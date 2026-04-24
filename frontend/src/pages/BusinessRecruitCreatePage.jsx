import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBarLoggedIn from '../components/TopNavBarLoggedIn';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import AddressSearchField from '../components/AddressSearchField';
import BusinessSidebar from '../components/business-mypage/BusinessSidebar';
import {
  createMyBusinessRecruit,
  getMyBusinessAccountSummary,
} from '../services/accountApi';

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

function BusinessRecruitCreatePage() {
  const navigate = useNavigate();

  const [companySummary, setCompanySummary] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState('');

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
    deadline: '',
    applicationMethods: ['ONLINE'],
    applyContact: '',
    description: DEFAULT_RECRUIT_TEMPLATE,
  });

  useEffect(() => {
    let mounted = true;
    const loadSummary = async () => {
      try {
        const data = await getMyBusinessAccountSummary();
        if (mounted) setCompanySummary(data);
      } catch {
        if (mounted) setCompanySummary(null);
      }
    };
    loadSummary();
    return () => {
      mounted = false;
    };
  }, []);

  const urgentDeadlineValid = useMemo(() => isUrgentDeadline(form.deadline), [form.deadline]);

  useEffect(() => {
    if (form.urgent && form.deadline && !urgentDeadlineValid) {
      setForm((prev) => ({ ...prev, urgent: false }));
      window.alert('긴급 공고는 오늘 기준 3일 이내 마감일일 때만 설정할 수 있습니다.');
    }
  }, [form.urgent, form.deadline, urgentDeadlineValid]);

  const handleChange = (event) => {
    const { name, value } = event.target;
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
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((item) => item !== day)
        : [...prev.workDays, day],
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

  const handleWorkplaceAddressSelect = ({ zonecode, address }) => {
    setForm((prev) => ({
      ...prev,
      workplacePostalCode: zonecode,
      workplaceAddress: address,
      workplaceAddressDetail: '',
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
    if (form.urgent && !urgentDeadlineValid) {
      setError('긴급 공고는 마감일이 3일 이내여야 합니다.');
      return;
    }
    if (!form.payAmount || Number(form.payAmount) <= 0) {
      setError('급여 금액을 올바르게 입력해주세요.');
      return;
    }
    if (!form.workDays.length) {
      setError('근무요일을 1개 이상 선택해주세요.');
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
      isUrgent: Boolean(form.urgent),
      deadline: form.deadline,
      salary: Number(form.payAmount),
      salaryType: form.payType,
      headCount: Number(form.recruitCount) || 1,
      regionId: null,
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
      await createMyBusinessRecruit(payload);
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

            <div className={`mb-6 rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${form.urgent ? 'bg-red-50 border-red-200' : 'bg-white border-outline'}`}>
              <div className="flex-1">
                <p className="font-bold text-sm">긴급 공고</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  긴급 공고는 마감일이 오늘 기준 3일 이내일 때만 체크할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleUrgent}
                className={`px-4 py-2 rounded-lg text-xs font-bold border ${form.urgent ? 'bg-red-500 text-white border-red-500' : 'bg-white text-on-surface-variant border-outline'}`}
              >
                {form.urgent ? '긴급 공고 사용 중' : '긴급 공고 사용'}
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormSection title="모집 내용">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Field label="공고 제목" name="title" value={form.title} onChange={handleChange} required />
                  </div>
                  <SelectField label="업직종" name="businessType" value={form.businessType} onChange={handleChange} options={BUSINESS_TYPE_OPTIONS} required />
                  <Field label="모집인원" name="recruitCount" value={form.recruitCount} onChange={handleChange} type="number" required />
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
                  <SelectField label="급여 기준" name="payType" value={form.payType} onChange={handleChange} options={SALARY_TYPE_OPTIONS} required />
                  <Field label="급여 금액(원)" name="payAmount" value={form.payAmount} onChange={handleChange} type="number" required />
                  <div className="md:col-span-2">
                    <span className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">근무요일 <Required /></span>
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
                  <div>
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
                </div>
              </FormSection>

              <div className="flex flex-col sm:flex-row gap-3 justify-end pb-6">
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

function Field({ label, name, value, onChange, type = 'text', placeholder = '', required = false }) {
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
        placeholder={placeholder}
        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
      />
    </label>
  );
}

function SelectField({ label, name, value, onChange, options, required = false }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">
        {label} {required && <Required />}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

export default BusinessRecruitCreatePage;

