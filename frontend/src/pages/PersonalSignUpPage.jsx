import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

export default function PersonalSignUpPage() {
  const [allAgree, setAllAgree] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    birth: '',
    gender: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllAgree = (checked) => {
    setAllAgree(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
  };

  const handleAgreeTerms = (checked) => {
    setAgreeTerms(checked);
    setAllAgree(checked && agreePrivacy);
  };

  const handleAgreePrivacy = (checked) => {
    setAgreePrivacy(checked);
    setAllAgree(checked && agreeTerms);
  };

  const isFormValid = useMemo(() => {
    const filled = Object.values(form).every((value) => value.trim() !== '');
    return filled && agreeTerms && agreePrivacy && form.password === form.confirmPassword;
  }, [form, agreeTerms, agreePrivacy]);

  return (
    <>
      <TopNavBar />
      <main className="pt-32 pb-24 bg-[#F9F9F9] min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-primary font-bold tracking-widest text-sm mb-4">JOIN THE FORCE</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface leading-tight">
              새로운 대타 요원을
              <br />
              환영합니다
            </h1>
            <p className="mt-4 text-on-surface-variant text-lg">
              개인 정보를 입력하고 실시간 대타 업무를 시작하세요.
            </p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <section className="bg-surface rounded-2xl p-8 md:p-10 shadow-sm border border-outline">
              <h2 className="text-xl font-extrabold mb-8 tracking-tight">약관 동의</h2>
              <div className="space-y-6">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-6 h-6 border-outline rounded text-primary focus:ring-primary"
                    checked={allAgree}
                    onChange={(e) => handleAllAgree(e.target.checked)}
                  />
                  <span className="text-lg font-bold">전체 동의하기</span>
                </label>
                <div className="h-[1px] bg-outline w-full"></div>
                <div className="space-y-5">
                  <label className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        className="w-5 h-5 border-outline rounded text-primary focus:ring-primary"
                        checked={agreeTerms}
                        onChange={(e) => handleAgreeTerms(e.target.checked)}
                      />
                      <span className="text-on-surface-variant font-medium">이용약관 동의 (필수) <span className="text-primary">*</span></span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">chevron_right</span>
                  </label>
                  <label className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        className="w-5 h-5 border-outline rounded text-primary focus:ring-primary"
                        checked={agreePrivacy}
                        onChange={(e) => handleAgreePrivacy(e.target.checked)}
                      />
                      <span className="text-on-surface-variant font-medium">개인정보 수집 및 이용 동의 (필수) <span className="text-primary">*</span></span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">chevron_right</span>
                  </label>
                </div>
              </div>
            </section>

            <section className="bg-surface rounded-2xl p-8 md:p-10 shadow-sm border border-outline">
              <h2 className="text-xl font-extrabold mb-10 tracking-tight">계정 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Username / ID <span className="text-primary">*</span></label>
                  <input name="username" value={form.username} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="아이디를 입력하세요" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email Address <span className="text-primary">*</span></label>
                  <input name="email" value={form.email} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="example@daeta.com" type="email" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Password <span className="text-primary">*</span></label>
                  <input name="password" value={form.password} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="••••••••" type="password" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Password <span className="text-primary">*</span></label>
                  <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="••••••••" type="password" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full Name <span className="text-primary">*</span></label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="홍길동" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date of Birth <span className="text-primary">*</span></label>
                  <input name="birth" value={form.birth} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="YYYYMMDD" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Gender <span className="text-primary">*</span></label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className={`flex-1 py-3.5 rounded-xl font-bold transition-all shadow-sm ${form.gender === 'male' ? 'bg-primary text-white' : 'bg-background border border-outline text-on-surface-variant hover:bg-outline'}`}
                      onClick={() => setForm((prev) => ({ ...prev, gender: 'male' }))}
                    >
                      MALE
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-3.5 rounded-xl font-bold transition-all shadow-sm ${form.gender === 'female' ? 'bg-primary text-white' : 'bg-background border border-outline text-on-surface-variant hover:bg-outline'}`}
                      onClick={() => setForm((prev) => ({ ...prev, gender: 'female' }))}
                    >
                      FEMALE
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone Number <span className="text-primary">*</span></label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="01012345678" type="tel" />
                </div>
              </div>
            </section>

            <div className="pt-8 flex flex-col gap-6">
              <p className="text-center text-xs text-on-surface-variant/60 mb-2">모든 필수 약관에 동의하고 필수 정보를 모두 입력하시면 버튼이 활성화됩니다.</p>
              <CommonButton
                type="submit"
                disabled={!isFormValid}
                size="fullLg"
                variant={isFormValid ? 'primary' : 'outline'}
                className={isFormValid ? '' : 'bg-outline text-on-surface-variant/40 hover:bg-outline border-outline'}
                icon={<span className="material-symbols-outlined">arrow_forward</span>}
              >
                COMPLETE REGISTRATION
              </CommonButton>
              <p className="text-center text-on-surface-variant text-sm">
                이미 회원이신가요? <Link className="underline font-bold text-on-surface" to="/login">로그인하기</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
      <AppFooter />
    </>
  );
}
