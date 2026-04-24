import React from 'react';

export default function BusinessDashboardTab() {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-outline rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">bolt</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-on-surface-variant mb-0.5">활성 공고</p>
                        <p className="text-xl font-black">
                            04 <span className="text-sm font-medium text-on-surface-variant">건</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-outline rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
            <span
                className="material-symbols-outlined text-yellow-500"
                style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-on-surface-variant mb-0.5">평균 평점</p>
                        <p className="text-xl font-black">
                            4.8 <span className="text-sm font-medium text-on-surface-variant">/ 5.0</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-outline rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-500">receipt_long</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-on-surface-variant mb-0.5">결제 내역</p>
                        <p className="text-xl font-black">
                            2일 전 <span className="text-sm font-medium text-on-surface-variant">최근</span>
                        </p>
                    </div>
                </div>
            </div>

            <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">공고 관리</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-outline text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
                            전체
                        </button>
                        <button className="px-3 py-1 bg-white border border-outline text-xs font-medium rounded-lg text-on-surface-variant hover:bg-gray-50 transition-colors">
                            진행중
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="bg-white border border-outline rounded-2xl p-5 hover:border-primary/30 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-primary">history_edu</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-primary bg-primary-soft px-1.5 py-0.5 rounded">
                      급구
                    </span>
                                        <span className="text-[10px] font-bold text-on-surface-variant">영상편집</span>
                                    </div>
                                    <h4 className="font-bold group-hover:text-primary transition-colors">
                                        뉴스 속보 전문 시니어 영상 편집자 구인
                                    </h4>
                                    <p className="text-xs text-on-surface-variant mt-0.5">2시간 전 등록 • 서울 강남구</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">지원자</p>
                                    <p className="text-xl font-black">12</p>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <span className="material-symbols-outlined text-sm text-on-surface-variant">edit</span>
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <span className="material-symbols-outlined text-sm text-on-surface-variant">analytics</span>
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-primary-soft transition-colors">
                                        <span className="material-symbols-outlined text-sm text-primary">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-outline rounded-2xl p-5 opacity-70 hover:opacity-100 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-on-surface-variant">closed_caption</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-on-surface-variant border border-outline px-1.5 py-0.5 rounded">
                      마감
                    </span>
                                    </div>
                                    <h4 className="font-bold">영어 자막 번역 전문가 (단기)</h4>
                                    <p className="text-xs text-on-surface-variant mt-0.5">3일 전 마감 • 재택근무</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">지원자</p>
                                    <p className="text-xl font-black">45</p>
                                </div>
                                <button className="px-4 py-2 bg-on-surface text-white text-xs font-bold rounded-lg hover:bg-primary transition-colors">
                                    재등록
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">최근 리뷰</h3>
                    <button className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                        전체 보기
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-outline rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <span
                                        key={idx}
                                        className="material-symbols-outlined text-primary text-[16px]"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                    star
                  </span>
                                ))}
                            </div>
                            <span className="text-[10px] text-on-surface-variant font-medium">2024.03.15</span>
                        </div>
                        <p className="text-sm font-semibold leading-relaxed mb-4">
                            "지급이 정말 빠르고 요청 사항이 매우 명확해서 좋았습니다. 급한 프로젝트가 있을 때 믿고 함께할 수 있습니다."
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center text-[10px] font-bold text-primary">
                                    JK
                                </div>
                                <span className="text-xs font-bold text-on-surface-variant">김제임스</span>
                            </div>
                            <button className="text-primary font-bold text-[11px] flex items-center gap-1">
                                답글 달기 <span className="material-symbols-outlined text-xs">reply</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-outline rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4].map((idx) => (
                                    <span
                                        key={idx}
                                        className="material-symbols-outlined text-primary text-[16px]"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                    star
                  </span>
                                ))}
                                <span className="material-symbols-outlined text-gray-200 text-[16px]">star</span>
                            </div>
                            <span className="text-[10px] text-on-surface-variant font-medium">2024.03.10</span>
                        </div>
                        <p className="text-sm font-semibold leading-relaxed mb-4">
                            "편집 과정 전반에 걸쳐 프로페셔널한 환경과 훌륭한 소통이 인상적이었습니다."
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-400">
                                    SP
                                </div>
                                <span className="text-xs font-bold text-on-surface-variant">박사라</span>
                            </div>
                            <span className="text-on-surface-variant font-bold text-[11px] bg-gray-50 px-2 py-0.5 rounded flex items-center gap-1">
                답변 완료
                <span
                    className="material-symbols-outlined text-xs text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}