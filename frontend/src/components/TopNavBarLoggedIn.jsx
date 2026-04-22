import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function TopNavBarLoggedIn() {
  const location = useLocation();
  const navigate = useNavigate();

  const member = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('member') || 'null');
    } catch (e) {
      return null;
    }
  }, [location.pathname]);

  const isActive = (path) => {
    if (location.pathname === '/') return false;
    if (path === '/recruit-information' && (location.pathname === '/recruit-detail' || location.pathname.startsWith('/recruit-detail'))) {
      return true;
    }
    return location.pathname === path;
  };

  const displayName = member?.name || member?.memberName || '회원';
  const imageUrl = member?.image || member?.profileImageUrl || '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('member');
    navigate('/');
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
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-outline overflow-hidden">
              {imageUrl ? (
                  <img src={imageUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">person</span>
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
        </div>
      </nav>
  );
}