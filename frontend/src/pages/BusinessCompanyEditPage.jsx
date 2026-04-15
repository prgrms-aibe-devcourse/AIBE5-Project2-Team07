import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNavBarLoggedIn from '../components/TopNavBarLoggedIn';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

function BusinessCompanyEditPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: '서울 에디토리얼',
    businessNumber: '123-45-67890',
    category: '카페/음료',
    address: '서울 강남구 테헤란로 18길 10, 2층',
    contactName: '김대타',
    contactPhone: '010-4822-1234',
    contactEmail: 'manager@daeta.co.kr',
    openTime: '08:00',
    closeTime: '22:00',
    payDay: '매주 금요일',
    intro:
      '강남역 인근에서 운영 중인 로컬 카페입니다. 피크 타임 응대와 매장 운영 경험자를 우대하며, 초보자도 빠르게 적응할 수 있도록 체계적으로 안내합니다.',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 현재는 UI 단계라 저장 결과만 안내합니다.
    window.alert('기업 정보가 저장되었습니다.');
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-on-surface">
      <TopNavBarLoggedIn />

      <div className="pt-20 min-h-screen">
        <div className="custom-container py-8 flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-outline p-6 sticky top-28">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-primary-soft rounded-2xl flex items-center justify-center mb-4 border border-primary/10">
                  <span className="material-symbols-outlined text-4xl text-primary">apartment</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <h2 className="font-bold text-lg">서울 에디토리얼</h2>
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">사업자번호 123-45-67890</p>
                <CommonButton
                  type="button"
                  onClick={() => navigate('/dashboard/recruit-create')}
                  size="full"
                  className="mt-4"
                  icon={<span className="material-symbols-outlined text-sm">add</span>}
                >
                  공고 등록하기
                </CommonButton>
                <span className="mt-2 w-full py-2 bg-primary-soft text-xs font-bold rounded-lg text-primary border border-primary/10">
                  기업 정보 수정
                </span>
              </div>

              <nav className="space-y-1">
                <Link
                  to="/dashboard?tab=dashboard"
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>
                  대시보드
                </Link>
                <Link
                  to="/dashboard?tab=recruits"
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">assignment</span>
                  공고 관리
                </Link>
                <Link
                  to="/dashboard?tab=applicants"
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">group</span>
                  지원자 현황
                </Link>
                <Link
                  to="/dashboard?tab=reviews"
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">rate_review</span>
                  리뷰 관리
                </Link>
                <Link
                  to="/dashboard?tab=work"
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  근무 관리
                </Link>
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-3xl font-black tracking-tight">기업 정보 수정</h1>
                <p className="text-sm text-on-surface-variant mt-1">사업자 정보와 운영 정보를 최신 상태로 유지해주세요.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard?tab=dashboard')}
                className="self-start md:self-auto px-4 py-2 rounded-lg border border-outline bg-white text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                대시보드로 돌아가기
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="bg-white border border-outline rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">기본 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="기업명" name="companyName" value={form.companyName} onChange={handleChange} />
                  <Field label="사업자번호" name="businessNumber" value={form.businessNumber} onChange={handleChange} />
                  <Field label="업종" name="category" value={form.category} onChange={handleChange} />
                  <Field label="사업장 주소" name="address" value={form.address} onChange={handleChange} />
                </div>
              </section>

              <section className="bg-white border border-outline rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">담당자 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="담당자명" name="contactName" value={form.contactName} onChange={handleChange} />
                  <Field label="연락처" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
                  <Field label="이메일" name="contactEmail" value={form.contactEmail} onChange={handleChange} />
                </div>
              </section>

              <section className="bg-white border border-outline rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">운영 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="오픈 시간" name="openTime" value={form.openTime} onChange={handleChange} />
                  <Field label="마감 시간" name="closeTime" value={form.closeTime} onChange={handleChange} />
                  <Field label="급여 정산일" name="payDay" value={form.payDay} onChange={handleChange} />
                </div>
              </section>

              <section className="bg-white border border-outline rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">기업 소개</h2>
                <label className="block">
                  <span className="text-xs font-bold text-on-surface-variant mb-2 block">소개 문구</span>
                  <textarea
                    name="intro"
                    value={form.intro}
                    onChange={handleChange}
                    rows={6}
                    className="w-full rounded-xl border border-outline bg-white px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
                  />
                </label>
              </section>

              <div className="flex flex-col sm:flex-row gap-3 justify-end pb-6">
                <CommonButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard?tab=dashboard')}
                >
                  취소
                </CommonButton>
                <CommonButton type="submit" size="sm">
                  저장하기
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

function Field({ label, name, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-on-surface-variant mb-2 block">{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
      />
    </label>
  );
}

export default BusinessCompanyEditPage;

