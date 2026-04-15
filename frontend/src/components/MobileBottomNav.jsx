import React from 'react';

export default function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-white/95 backdrop-blur-lg border-t-[0.5px] border-outline flex justify-around items-center px-6 pb-safe z-50">
      <a className="flex flex-col items-center justify-center text-primary" href="#">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span>
        <span className="text-[10px] font-bold mt-1">긴급</span>
      </a>
      <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
        <span className="material-symbols-outlined">chat_bubble</span>
        <span className="text-[10px] font-bold mt-1">채팅</span>
      </a>
      <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
        <span className="material-symbols-outlined">person</span>
        <span className="text-[10px] font-bold mt-1">프로필</span>
      </a>
    </nav>
  );
}

