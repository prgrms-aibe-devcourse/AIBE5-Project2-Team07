import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function TopNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSignupModal, setShowSignupModal] = useState(false);

  const isActive = (path) => {
    // MainPage(/)에서는 하이라이팅 없음
    // 다른 페이지에서만 해당 경로가 활성화될 때 하이라이팅
    if (location.pathname === '/') return false;
    if (path === '/recruit-information' && (location.pathname === '/recruit-detail' || location.pathname.startsWith('/recruit-detail'))) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b-[0.5px] border-outline">
        <div className="flex justify-between items-center h-20 w-full custom-container">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-3xl font-black text-primary tracking-tighter cursor-pointer">대타</Link>
            <div className="hidden md:flex gap-8 items-center h-20">
              <Link
                to="/recruit-information"
                className={`font-bold text-sm tracking-tight border-b-2 h-20 flex items-center transition-colors ${
                  isActive('/recruit-information')
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`}
              >
                채용정보
              </Link>
              <Link
                to="/brand"
                className={`font-bold text-sm tracking-tight border-b-2 h-20 flex items-center transition-colors ${
                  isActive('/brand')
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`}
              >
                브랜드알바
              </Link>
              <Link
                to="/human-information"
                className={`font-bold text-sm tracking-tight border-b-2 h-20 flex items-center transition-colors ${
                  isActive('/human-information')
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`}
              >
                인재정보
              </Link>
              <Link
                to="/ai-recommend"
                className={`font-bold text-sm tracking-tight border-b-2 h-20 flex items-center transition-colors ${
                  isActive('/ai-recommend')
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`}
              >
                AI추천매칭
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              className="text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors"
              onClick={() => navigate('/login')}
            >
              로그인
            </button>
            <button
              className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold active:opacity-90 transition-all hover:bg-primary-deep shadow-sm"
              onClick={() => setShowSignupModal(true)}
            >
              회원가입
            </button>
          </div>
        </div>
      </nav>

      <div className={`${showSignupModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
        <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setShowSignupModal(false)}></div>
        <div className="relative bg-white w-full max-w-md p-8 rounded-2xl border border-outline text-center">
          <div className="w-14 h-14 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>
              person_add
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">회원 유형을 선택해주세요</h3>
          <p className="text-on-surface-variant text-sm mb-6">원하는 회원 유형으로 가입을 진행할 수 있습니다.</p>
          <div className="space-y-3">
            <button
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-deep transition-colors"
              onClick={() => {
                setShowSignupModal(false);
                navigate('/signup/personal');
              }}
            >
              개인회원 가입
            </button>
            <button
              className="w-full py-4 bg-gray-100 text-on-surface font-bold rounded-xl hover:bg-gray-200 transition-colors"
              onClick={() => {
                setShowSignupModal(false);
                navigate('/signup/business');
              }}
            >
              사업자회원 가입
            </button>
          </div>
          <button
            className="mt-5 text-sm text-on-surface-variant underline underline-offset-4"
            onClick={() => setShowSignupModal(false)}
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}
