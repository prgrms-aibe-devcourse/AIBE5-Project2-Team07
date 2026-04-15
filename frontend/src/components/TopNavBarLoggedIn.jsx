import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function TopNavBarLoggedIn() {
  const location = useLocation();

  const isActive = (path) => {
    if (location.pathname === '/') return false;
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b-[0.5px] border-outline">
      <div className="flex justify-between items-center h-20 w-full custom-container">
        {/* 로고 + 메뉴 링크 */}
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
              to="/dashboard"
              className={`font-bold text-sm tracking-tight border-b-2 h-20 flex items-center transition-colors ${
                isActive('/dashboard')
                  ? 'text-primary border-primary'
                  : 'text-on-surface-variant border-transparent hover:text-primary'
              }`}
            >
              내 대시보드
            </Link>
          </div>
        </div>
        {/* 유저 정보 + 로그아웃 */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-outline overflow-hidden">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">person</span>
          </div>
          <span className="text-sm font-semibold hidden sm:block text-on-surface">김대타 님</span>
          <button className="text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors">
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}

