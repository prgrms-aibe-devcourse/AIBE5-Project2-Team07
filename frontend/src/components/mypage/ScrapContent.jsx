import React, { useState } from 'react';
import { SCRAP_JOBS } from '../../constants/mypageConstants';

export default function ScrapContent() {
    const [scraps, setScraps] = useState(SCRAP_JOBS);

    const removeScrap = (id) => {
        setScraps((prev) => prev.filter((j) => j.id !== id));
    };

    return (
        <section className="flex-grow space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#1F1D1D] mb-1">스크랩한 공고</h1>
                    <p className="text-sm text-[#6B6766]">관심 있는 공고를 저장하고 한눈에 확인하세요.</p>
                </div>
                <span className="bg-[#FFF0F3] text-primary text-sm font-bold px-4 py-2 rounded-xl border border-primary/10">
          총 {scraps.length}개
        </span>
            </div>

            {scraps.length === 0 ? (
                <div className="bg-white border border-[#EAE5E3] rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-16 h-16 bg-[#FFF0F3] rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">bookmark</span>
                    </div>
                    <p className="font-bold text-[#1F1D1D] mb-1">스크랩한 공고가 없습니다</p>
                    <p className="text-sm text-[#6B6766]">마음에 드는 공고를 스크랩해 보세요.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {scraps.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white border border-[#EAE5E3] rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all group shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#FFF0F3] rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/10">
                                    <span className="material-symbols-outlined text-primary text-2xl">apartment</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-[#6B6766] font-medium mb-0.5">{job.company}</p>
                                    <h3 className="font-bold text-[#1F1D1D] group-hover:text-primary transition-colors text-base leading-snug mb-2">
                                        {job.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {job.tags.map((tag) => (
                                            <span key={tag} className="text-[11px] font-bold bg-[#FFF0F3] text-primary px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B6766] font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-primary">payments</span>
                        {job.pay}
                    </span>
                                        <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#6B6766]">location_on</span>
                                            {job.location}
                    </span>
                                        <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#6B6766]">calendar_today</span>
                      마감 {job.deadline}
                    </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => removeScrap(job.id)}
                                        className="p-2 rounded-xl hover:bg-[#FFF0F3] transition-colors"
                                        title="스크랩 해제"
                                    >
                    <span
                        className="material-symbols-outlined text-primary text-xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bookmark
                    </span>
                                    </button>
                                    <button className="text-xs font-bold text-[#6B6766] hover:text-primary transition-colors flex items-center gap-0.5">
                                        상세 보기
                                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-5 rounded-2xl bg-[#FFF0F3]/50 border border-primary/10 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5 text-sm">info</span>
                <p className="text-xs text-[#6B6766] font-medium leading-relaxed">
                    북마크 아이콘을 클릭하면 스크랩이 해제됩니다. 마감된 공고는 자동으로 목록에서 제거됩니다.
                </p>
            </div>
        </section>
    );
}