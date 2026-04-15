import React from 'react';

export default function AppFooter() {
  return (
    <footer className="w-full py-20 bg-white border-t border-outline">
      <div className="custom-container grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
        <div>
          <span className="font-black text-2xl text-primary tracking-tighter mb-6 block">대타</span>
          <p className="text-on-surface-variant text-sm font-medium tracking-wide">
            © 2026 Daeta Inc. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4 md:justify-end">
          <a className="text-on-surface-variant hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest" href="#">
            개인정보처리방침
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest" href="#">
            이용약관
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest" href="#">
            고객지원
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest" href="#">
            네트워크
          </a>
        </div>
      </div>
    </footer>
  );
}

