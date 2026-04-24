import React from 'react';

export default function BusinessApplicantsTab() {
    return (
        <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
            Management
          </span>
                    <h2 className="text-2xl font-black text-on-surface">지원자 현황</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-white border border-outline px-4 py-2 rounded-lg text-on-surface text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-sm">filter_list</span>
                        정렬 방식
                    </button>
                    <button className="bg-primary px-6 py-2 rounded-lg text-white text-sm font-bold hover:bg-primary-deep transition-colors">
                        공고 수정
                    </button>
                </div>
            </header>

            <section className="bg-white border border-outline rounded-2xl p-10 text-center text-on-surface-variant">
                지원자 현황 API 연결 전 임시 화면입니다.
            </section>
        </>
    );
}