import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNavBarLoggedIn from '../components/TopNavBarLoggedIn';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

/* ────────────────────────────────── 상수 ────────────────────────────────── */
const WORK_PERIOD_OPTIONS = [
  { value: '1', label: '하루' },
  { value: '2', label: '일주일 이하' },
  { value: '4', label: '일주일~1개월' },
  { value: '8', label: '1개월~3개월' },
  { value: '16', label: '3개월~6개월' },
  { value: '32', label: '1년 이상' },
];

const WORK_TIME_OPTIONS = [
  { value: '1', label: '오전 파트' },
  { value: '2', label: '오후 파트' },
  { value: '4', label: '저녁 파트' },
  { value: '8', label: '새벽 파트' },
  { value: '16', label: '오전~오후 파트' },
  { value: '32', label: '오후~저녁 파트' },
  { value: '64', label: '저녁~새벽 파트' },
  { value: '128', label: '새벽~오전 파트' },
  { value: '256', label: '8시간 이상 풀타임' },
];

const BUSINESS_TYPE_OPTIONS = [
  { value: '1', label: '외식음료' },
  { value: '2', label: '매장관리판매' },
  { value: '4', label: '서비스' },
  { value: '8', label: '운전배달' },
  { value: '16', label: '현장단순노무' },
];

const SALARY_TYPE_OPTIONS = [
  { value: 'H', label: '시급' },
  { value: 'M', label: '월급' },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'part', label: '알바/파트타임' },
  { value: 'full', label: '정규직' },
  { value: 'contract', label: '계약직' },
  { value: 'freelance', label: '프리랜서' },
  { value: 'daily', label: '일용직' },
];

const APPLICATION_METHOD_OPTIONS = [
  { value: 'online', label: '온라인 지원' },
  { value: 'email', label: '이메일 지원' },
  { value: 'visit', label: '방문 접수' },
  { value: 'phone', label: '전화 지원' },
];

const WORK_DAYS = [
  { bit: 1, label: '월' },
  { bit: 2, label: '화' },
  { bit: 4, label: '수' },
  { bit: 8, label: '목' },
  { bit: 16, label: '금' },
  { bit: 32, label: '토' },
  { bit: 64, label: '일' },
];

/* ─────────────────────────────── 메인 컴포넌트 ────────────────────────────── */
function BusinessRecruitCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    urgent: false,
    // 기업정보
    businessMain: '',
    branchCode: '',
    // 모집내용
    title: '',
    businessType: '1',
    requiredSkills: '',
    employmentType: 'part',
    recruitCount: '1',
    genderAgeEdu: '',
    recruitField: '',
    preferredConditions: '',
    // 근무조건
    workPeriod: '1',
    workDays: 0,
    workTime: '1',
    payType: 'H',
    payAmount: '',
    benefits: '',
    // 근무지정보
    workplaceAddress: '',
    exposureRegion: '',
    companyName: '',
    logoFile: null,
    mediaFiles: null,
    // 접수기간·방법
    deadline: '',
    applicationMethod: 'online',
    preQuestions: '',
    // 담당자정보
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    managerFax: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files : value,
    }));
  };

  const toggleWorkDay = (bit) => {
    setForm((prev) => ({ ...prev, workDays: prev.workDays ^ bit }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      is_urgent: form.urgent ? 'Y' : 'N',
      business_main: form.businessMain,
      branch_code: form.branchCode,
      title: form.title,
      business_type: Number(form.businessType),
      required_skills: form.requiredSkills,
      employment_type: form.employmentType,
      headcount: Number(form.recruitCount) || null,
      gender_age_edu: form.genderAgeEdu,
      recruit_field: form.recruitField,
      preferred_conditions: form.preferredConditions,
      work_period: Number(form.workPeriod),
      work_days: form.workDays,
      work_time: Number(form.workTime),
      salary_type: form.payType,
      salary: Number(form.payAmount),
      benefits: form.benefits,
      detail_address: form.workplaceAddress,
      exposure_region: form.exposureRegion,
      company_name: form.companyName,
      deadline: form.deadline,
      application_method: form.applicationMethod,
      pre_questions: form.preQuestions,
      manager_name: form.managerName,
      manager_phone: form.managerPhone,
      manager_email: form.managerEmail,
      manager_fax: form.managerFax,
    };
    console.log('recruit-create payload', payload);
    window.alert('공고가 등록되었습니다.');
    navigate('/dashboard?tab=recruits');
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-on-surface">
      <TopNavBarLoggedIn />

      <div className="pt-20 min-h-screen">
        <div className="custom-container py-8 flex flex-col lg:flex-row gap-8">
          {/* ── 사이드바 ── */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-outline p-6 sticky top-28">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-primary-soft rounded-2xl flex items-center justify-center mb-4 border border-primary/10">
                  <span className="material-symbols-outlined text-4xl text-primary">apartment</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <h2 className="font-bold text-lg">서울 에디토리얼</h2>
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <p className="text-xs text-on-surface-variant">사업자번호 123-45-67890</p>
                <span className="mt-4 w-full bg-primary text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">add</span>공고 등록하기
                </span>
                <button type="button" onClick={() => navigate('/dashboard/company-edit')}
                  className="mt-2 w-full py-2 bg-gray-50 text-xs font-bold rounded-lg border border-outline hover:bg-gray-100 transition-colors">
                  기업 정보 수정
                </button>
              </div>
              <nav className="space-y-1">
                <Link to="/dashboard?tab=dashboard" className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>대시보드
                </Link>
                <Link to="/dashboard?tab=recruits" className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-primary bg-primary-soft font-bold">
                  <span className="material-symbols-outlined text-[20px]">assignment</span>공고 관리
                </Link>
                <Link to="/dashboard?tab=applicants" className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">group</span>지원자 현황
                </Link>
                <Link to="/dashboard?tab=reviews" className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">rate_review</span>리뷰 관리
                </Link>
                <Link to="/dashboard?tab=work" className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>근무 관리
                </Link>
              </nav>
            </div>
          </aside>

          {/* ── 본문 ── */}
          <main className="flex-1 min-w-0">
            <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-3xl font-black tracking-tight">공고 등록</h1>
                <p className="text-sm text-on-surface-variant mt-1">아래 양식을 작성해 구인 공고를 등록하세요. <span className="text-red-500 font-bold">*</span> 표시 항목은 필수입니다.</p>
              </div>
              <button type="button" onClick={() => navigate('/dashboard?tab=recruits')}
                className="self-start md:self-auto px-4 py-2 rounded-lg border border-outline bg-white text-sm font-bold hover:bg-gray-50 transition-colors">
                공고 관리로 돌아가기
              </button>
            </header>

            {/* ── 긴급공고 토글 배너 ── */}
            <div className={`mb-6 rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors ${form.urgent ? 'bg-red-50 border-red-200' : 'bg-white border-outline'}`}>
              <div className="flex items-center gap-3 flex-1">
                <span className={`material-symbols-outlined text-2xl ${form.urgent ? 'text-red-500' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {form.urgent ? 'notifications_active' : 'notifications'}
                </span>
                <div>
                  <p className="font-bold text-sm">긴급 공고 등록</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    긴급 공고 체크 시 적용되며, <span className="font-bold text-red-500">3일 이내 마감</span> 긴급 공고로 등록됩니다. 긴급 공고는 근무일을 직접 입력합니다.
                  </p>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer flex-shrink-0">
                <div
                  onClick={() => setForm((prev) => ({ ...prev, urgent: !prev.urgent }))}
                  className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${form.urgent ? 'bg-red-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.urgent ? 'translate-x-5' : ''}`} />
                </div>
                <span className={`text-sm font-bold ${form.urgent ? 'text-red-500' : 'text-on-surface-variant'}`}>
                  {form.urgent ? '긴급 공고' : '일반 공고'}
                </span>
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── 1. 기업 정보 ── */}
              <FormSection title="기업 정보">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block">
                      <span className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">
                        주요사업 내용 <Required /> <span className="font-normal text-on-surface-variant/60">(최대 50자)</span>
                      </span>
                      <input name="businessMain" value={form.businessMain} onChange={handleChange}
                        maxLength={50} placeholder="예: 카페 음료 제조 및 홀 서빙 전반"
                        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                      <p className="text-right text-[10px] text-on-surface-variant mt-1">{form.businessMain.length}/50</p>
                    </label>
                  </div>
                  <Field label="지점코드" name="branchCode" value={form.branchCode} onChange={handleChange} placeholder="없으면 비워두세요" />
                </div>
              </FormSection>

              {/* ── 2. 모집 내용 ── */}
              <FormSection title="모집 내용">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Field label="공고 제목" name="title" value={form.title} onChange={handleChange}
                      placeholder="예: 강남역 카페 주말 오픈 파트타임" required />
                  </div>
                  <SelectField label="업직종" name="businessType" value={form.businessType} onChange={handleChange}
                    options={BUSINESS_TYPE_OPTIONS} required />
                  <Field label="필요 업무 스킬" name="requiredSkills" value={form.requiredSkills} onChange={handleChange}
                    placeholder="예: 바리스타 자격증, 라떼아트" />
                  <SelectField label="고용형태" name="employmentType" value={form.employmentType} onChange={handleChange}
                    options={EMPLOYMENT_TYPE_OPTIONS} required />
                  <Field label="모집인원" name="recruitCount" value={form.recruitCount} onChange={handleChange}
                    type="number" placeholder="명 (미정이면 0)" required />
                  <Field label="성별·연령·학력" name="genderAgeEdu" value={form.genderAgeEdu} onChange={handleChange}
                    placeholder="예: 무관 / 20~30대 / 학력무관" />
                  <Field label="모집분야" name="recruitField" value={form.recruitField} onChange={handleChange}
                    placeholder="예: 홀서빙, 주방보조" />
                  <div className="md:col-span-2">
                    <label className="block">
                      <span className="text-xs font-bold text-on-surface-variant mb-2 block">우대조건</span>
                      <input name="preferredConditions" value={form.preferredConditions} onChange={handleChange}
                        placeholder="예: 경력자 우대, 즉시 출근 가능자 우대"
                        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                    </label>
                  </div>
                </div>
              </FormSection>

              {/* ── 3. 근무 조건 ── */}
              <FormSection title="근무 조건">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField label="근무기간" name="workPeriod" value={form.workPeriod} onChange={handleChange}
                    options={WORK_PERIOD_OPTIONS} required />
                  <SelectField label="근무시간" name="workTime" value={form.workTime} onChange={handleChange}
                    options={WORK_TIME_OPTIONS} required />
                  <div className="md:col-span-2">
                    <span className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">
                      근무요일 <Required />
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {WORK_DAYS.map(({ bit, label }) => {
                        const active = (form.workDays & bit) !== 0;
                        return (
                          <CommonButton
                            key={bit}
                            type="button"
                            onClick={() => toggleWorkDay(bit)}
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
                    <p className="text-[10px] text-on-surface-variant mt-1.5">비트값: {form.workDays}</p>
                  </div>
                  <SelectField label="급여 기준" name="payType" value={form.payType} onChange={handleChange}
                    options={SALARY_TYPE_OPTIONS} required />
                  <Field label="급여 금액 (원)" name="payAmount" value={form.payAmount} onChange={handleChange}
                    type="number" placeholder="예: 12500" required />
                  <div className="md:col-span-2">
                    <label className="block">
                      <span className="text-xs font-bold text-on-surface-variant mb-2 block">복리후생</span>
                      <input name="benefits" value={form.benefits} onChange={handleChange}
                        placeholder="예: 식사제공, 교통비지원, 4대보험"
                        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                    </label>
                  </div>
                </div>
              </FormSection>

              {/* ── 4. 근무지 정보 ── */}
              <FormSection title="근무지 정보">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Field label="근무지 주소" name="workplaceAddress" value={form.workplaceAddress}
                      onChange={handleChange} placeholder="예: 서울 강남구 테헤란로 18길 10, 2층" required />
                  </div>
                  <Field label="공고노출지역" name="exposureRegion" value={form.exposureRegion}
                    onChange={handleChange} placeholder="예: 서울 강남구" />
                  <Field label="근무회사명" name="companyName" value={form.companyName}
                    onChange={handleChange} placeholder="예: 서울 에디토리얼" />
                  <div>
                    <label className="block">
                      <span className="text-xs font-bold text-on-surface-variant mb-2 block">로고</span>
                      <input name="logoFile" type="file" accept="image/*" onChange={handleChange}
                        className="w-full rounded-xl border border-outline bg-white px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary-soft file:text-primary file:text-xs file:font-bold cursor-pointer" />
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-xs font-bold text-on-surface-variant mb-2 block">사진·동영상</span>
                      <input name="mediaFiles" type="file" accept="image/*,video/*" multiple onChange={handleChange}
                        className="w-full rounded-xl border border-outline bg-white px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary-soft file:text-primary file:text-xs file:font-bold cursor-pointer" />
                    </label>
                  </div>
                </div>
              </FormSection>

              {/* ── 5. 접수기간·방법 ── */}
              <FormSection title="접수기간·방법">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block">
                      <span className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">
                        {form.urgent ? '근무일' : '모집종료일'} <Required />
                        {form.urgent && (
                          <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-500 text-[9px] font-bold rounded">긴급</span>
                        )}
                      </span>
                      <input name="deadline" type="date" value={form.deadline} onChange={handleChange}
                        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                    </label>
                  </div>
                  <SelectField label="접수방법" name="applicationMethod" value={form.applicationMethod}
                    onChange={handleChange} options={APPLICATION_METHOD_OPTIONS} required />
                  <div className="md:col-span-2">
                    <label className="block">
                      <span className="text-xs font-bold text-on-surface-variant mb-2 block">사전질문·확인요청사항</span>
                      <textarea name="preQuestions" value={form.preQuestions} onChange={handleChange} rows={3}
                        placeholder="지원자에게 사전 확인할 내용을 입력하세요"
                        className="w-full rounded-xl border border-outline bg-white px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none" />
                    </label>
                  </div>
                </div>
              </FormSection>

              {/* ── 6. 담당자 정보 ── */}
              <FormSection title="담당자 정보">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="담당자명" name="managerName" value={form.managerName}
                    onChange={handleChange} placeholder="예: 김대타" required />
                  <Field label="연락처" name="managerPhone" value={form.managerPhone}
                    onChange={handleChange} placeholder="예: 010-1234-5678" required />
                  <Field label="이메일" name="managerEmail" value={form.managerEmail}
                    onChange={handleChange} type="email" placeholder="예: manager@daeta.co.kr" />
                  <Field label="팩스번호" name="managerFax" value={form.managerFax}
                    onChange={handleChange} placeholder="예: 02-1234-5678" />
                </div>
              </FormSection>

              {/* ── 액션 버튼 ── */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pb-6">
                <CommonButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard?tab=recruits')}
                >
                  취소
                </CommonButton>
                <CommonButton type="submit" size="sm">
                  등록하기
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

/* ────────────────────────── 재사용 UI 컴포넌트 ─────────────────────────────── */
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
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
    </label>
  );
}

function SelectField({ label, name, value, onChange, options, required = false }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">
        {label} {required && <Required />}
      </span>
      <select name={name} value={value} onChange={onChange}
        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

export default BusinessRecruitCreatePage;

