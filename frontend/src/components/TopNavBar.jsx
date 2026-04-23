import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function TopNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const signupMenuRef = useRef(null);

  const [member, setMember] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signupMenuOpen, setSignupMenuOpen] = useState(false);

  const isActive = (path) => {
    if (location.pathname === '/') return false;
    if (
        path === '/recruit-information' &&
        (location.pathname === '/recruit-detail' || location.pathname.startsWith('/recruit-detail'))
    ) {
      return true;
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const memberStr = localStorage.getItem('member');

    if (token && memberStr) {
      try {
        const parsedMember = JSON.parse(memberStr);
        setMember(parsedMember);
        setIsLoggedIn(true);
      } catch (e) {
        setMember(null);
        setIsLoggedIn(false);
      }
    } else {
      setMember(null);
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (signupMenuRef.current && !signupMenuRef.current.contains(event.target)) {
        setSignupMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('member');
    setMember(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  const displayName = member?.name || member?.memberName || '회원';

  const handleMoveSignup = (type) => {
    setSignupMenuOpen(false);
    navigate(type === 'business' ? '/signup/business' : '/signup/personal');
  };

  return (
      <nav className="fixed top-0 w-full z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b-[0.5px] border-outline">
        <div className="flex justify-between items-center h-20 w-full custom-container">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-3xl font-black text-primary tracking-tighter cursor-pointer">
              대타
            </Link>

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

              {isLoggedIn && (
                  <Link
                      to="/mypage"
                      className={`font-bold text-sm tracking-tight border-b-2 h-20 flex items-center transition-colors ${
                          isActive('/mypage') || isActive('/personal-mypage') || isActive('/business-mypage')
                              ? 'text-primary border-primary'
                              : 'text-on-surface-variant border-transparent hover:text-primary'
                      }`}
                  >
                    내 대시보드
                  </Link>
              )}
            </div>
          </div>

          {!isLoggedIn ? (
              <div className="flex items-center gap-6">
                <button
                    onClick={() => navigate('/login')}
                    className="text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors"
                >
                  로그인
                </button>

                <div className="relative" ref={signupMenuRef}>
                  <button
                      onClick={() => setSignupMenuOpen((prev) => !prev)}
                      className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition flex items-center gap-2"
                  >
                    회원가입
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </button>

                  {signupMenuOpen && (
                      <div className="absolute right-0 mt-3 w-52 bg-white border border-outline rounded-2xl shadow-xl p-2 z-50">
                        <button
                            onClick={() => handleMoveSignup('personal')}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#FFF0F3] transition-colors"
                        >
                          <div className="font-bold text-sm text-on-surface">개인회원 가입</div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            구직자 · 알바 지원자용
                          </div>
                        </button>

                        <button
                            onClick={() => handleMoveSignup('business')}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#FFF0F3] transition-colors"
                        >
                          <div className="font-bold text-sm text-on-surface">사업자회원 가입</div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            기업 · 점주 · 채용 담당자용
                          </div>
                        </button>
                      </div>
                  )}
                </div>
              </div>
          ) : (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-outline overflow-hidden">
                  {member?.image ? (
                      <img src={member.image} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                      <span className="material-symbols-outlined text-on-surface-variant text-xl">
                  person
                </span>
                  )}
                </div>

                <span className="text-sm font-semibold hidden sm:block text-on-surface">
              {displayName} 님
            </span>

                <button
                    onClick={handleLogout}
                    className="text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors"
                >
                  로그아웃
                </button>
              </div>
          )}
        </div>
      </nav>
  );
}