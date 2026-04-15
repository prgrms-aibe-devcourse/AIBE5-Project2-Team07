import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

export default function LoginPage() {
  const [loginType, setLoginType] = useState('personal');
  const navigate = useNavigate();

  const loginButtonText = loginType === 'personal' ? '개인회원 로그인' : '사업자회원 로그인';
  const signupButtonText = loginType === 'personal' ? '개인회원 가입' : '사업자회원 가입';

  const handleSignupMove = () => {
    navigate(loginType === 'personal' ? '/signup/personal' : '/signup/business');
  };

  return (
    <>
      <TopNavBar />
      <main className="pt-32 pb-16 min-h-screen bg-[#FAF9F6]">
        <section className="max-w-xl mx-auto px-6">
          <div className="bg-white border border-outline rounded-2xl p-8 md:p-10">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">Account</p>
            <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2">로그인</h1>
            <p className="text-on-surface-variant text-sm mb-8">대타에서 빠르게 일자리를 찾거나 인재를 매칭해보세요.</p>

            <div className="grid grid-cols-2 bg-[#F2F2F2] rounded-xl p-1 mb-8">
              <button
                className={`py-2.5 text-sm font-bold rounded-lg transition-colors ${
                  loginType === 'personal' ? 'bg-white text-on-surface' : 'text-on-surface-variant'
                }`}
                onClick={() => setLoginType('personal')}
                type="button"
              >
                개인회원
              </button>
              <button
                className={`py-2.5 text-sm font-bold rounded-lg transition-colors ${
                  loginType === 'business' ? 'bg-white text-on-surface' : 'text-on-surface-variant'
                }`}
                onClick={() => setLoginType('business')}
                type="button"
              >
                사업자회원
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                  placeholder="example@daeta.com"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <CommonButton size="full" type="submit">
                {loginButtonText}
              </CommonButton>
            </form>

            <button
              type="button"
              className="w-full mt-4 bg-[#FEE500] text-[#191919] font-bold py-4 rounded-xl hover:brightness-95 transition-all"
            >
              카카오로 로그인
            </button>

            <CommonButton
              type="button"
              variant="subtle"
              size="full"
              className="mt-3"
              onClick={handleSignupMove}
            >
              {signupButtonText}
            </CommonButton>

            <div className="flex items-center justify-between text-xs mt-6 text-on-surface-variant">
              <button type="button" className="hover:text-primary">아이디 찾기</button>
              <button type="button" className="hover:text-primary">비밀번호 찾기</button>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </>
  );
}
