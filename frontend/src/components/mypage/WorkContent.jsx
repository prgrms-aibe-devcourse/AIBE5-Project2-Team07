import React from 'react';

export default function WorkContent() {
    return (
        <section className="flex-grow space-y-8">
            <div className="bg-white rounded-2xl border border-[#EAE5E3] p-8 shadow-sm">
                <h2 className="text-2xl font-black tracking-tight text-[#1F1D1D] mb-2">근무 관리</h2>
                <p className="text-sm text-[#6B6766]">
                    근무 관리 탭은 근무 내역 API가 준비되면 연결하는 것이 좋습니다.
                </p>
            </div>
        </section>
    );
}