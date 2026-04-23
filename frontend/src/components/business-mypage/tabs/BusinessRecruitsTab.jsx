import React from 'react';

export default function BusinessRecruitsTab() {
    return (
        <div className="space-y-8">
            <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-on-surface">공고 관리</h1>
                    <p className="text-sm text-on-surface-variant">
                        작성하신 긴급 공고 현황을 확인하고 지원자를 관리하세요.
                    </p>
                </div>
                <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
                    <input
                        className="w-full bg-white border border-outline rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        placeholder="공고명 검색"
                        type="text"
                    />
                </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-outline rounded-2xl p-5">
                    <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        전체 공고
                    </p>
                    <p className="text-2xl font-black text-on-surface">12</p>
                </div>
                <div className="bg-white border border-outline rounded-2xl p-5 border-l-4 border-l-primary">
                    <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        진행 중
                    </p>
                    <p className="text-2xl font-black text-primary">3</p>
                </div>
                <div className="bg-white border border-outline rounded-2xl p-5">
                    <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        마감됨
                    </p>
                    <p className="text-2xl font-black text-on-surface">9</p>
                </div>
                <div className="bg-white border border-outline rounded-2xl p-5">
                    <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        새 지원자
                    </p>
                    <p className="text-2xl font-black text-[#6c46ad]">14</p>
                </div>
            </section>

            <section className="bg-white border border-outline rounded-2xl p-10 text-center text-on-surface-variant">
                공고 관리 API 연결 전 임시 화면입니다.
            </section>
        </div>
    );
}