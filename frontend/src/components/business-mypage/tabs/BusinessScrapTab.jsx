import React from 'react';

const SCRAP_MEMBERS = [
    {
        id: 1,
        name: '김민준',
        role: '바리스타 · 홀서빙',
        location: '서울 강남구',
        exp: '경력 3년',
        rating: 4.8,
        reviewCount: 24,
        tags: ['바리스타', '홀서빙', '단기 가능'],
        available: true,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXkMJjGuJdAOyOjPMscb75mMfIZvaAoffyOuEVjhe-ckVK2M-Oj89UgT6e_4MIu6hwvDFCwovpMbkrgwHeWwbcnyPd0pcG1uqvPjrQvGTpH3GxjvUtsSuHZWxVZcmONgtgM-3Xy2PhPsEunvoVRyD9PP2JWx_95Ql1Jda5_vrl1k2-E5Ri8JE1GM5mVlYzcuBe8ANJYT-LTrKvPLhwU2WAZOhqLpJbXCMSyxx3YLypOL2TRLMUPAYfWMQqqi_5DmjPuep4ezqs5ag',
    },
    {
        id: 2,
        name: '이지은',
        role: '헬스 트레이너',
        location: '서울 강남구',
        exp: '경력 5년',
        rating: 4.9,
        reviewCount: 31,
        tags: ['트레이너', '오전 가능', '장기 선호'],
        available: true,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-nD7znoOOeOaREqQ8C9uuJ7yJekJ63cx7zvA_DqUCD1j9scbLzNU8MmXlikcPtbRwiXdd_1rg4E776ppHnXroW5oTUk88ixYr564gzTziqjGhUTL_tBbfInBZoq_oaSHvaZ0i9Ae2pZpvsU_PY1wy6UWLxYRaxdVPCoQmSRgFAu3hz9RZgxJISGk2V_bFUbkDbcxOVS54ehfjQP4Z6kXrt7wE9hBzx-1bLeCgj96wKSphh6OrIFm4XGi3EM4ipM2LQ2FcWYQZogI',
    },
];

export default function BusinessScrapTab() {
    const [scraps, setScraps] = React.useState(SCRAP_MEMBERS);

    const removeScrap = (id) => {
        setScraps((prev) => prev.filter((m) => m.id !== id));
    };

    return (
        <>
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black mb-1">스크랩 회원</h1>
                        <p className="text-sm text-on-surface-variant">
                            관심 있는 구직자를 저장하고 필요할 때 바로 연락하세요.
                        </p>
                    </div>
                    <span className="bg-primary-soft text-primary text-sm font-bold px-4 py-2 rounded-xl border border-primary/10">
            총 {scraps.length}명
          </span>
                </div>
            </header>

            {scraps.length === 0 ? (
                <div className="bg-white border border-outline rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-primary-soft rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">bookmark</span>
                    </div>
                    <p className="font-bold mb-1">스크랩한 회원이 없습니다</p>
                    <p className="text-sm text-on-surface-variant">
                        지원자 현황에서 마음에 드는 구직자를 스크랩해 보세요.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {scraps.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white border border-outline rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="relative flex-shrink-0">
                                    {member.img ? (
                                        <img
                                            src={member.img}
                                            alt={member.name}
                                            className="w-14 h-14 rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-2xl bg-primary-soft flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-3xl">
                        person
                      </span>
                                        </div>
                                    )}
                                    <span
                                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                            member.available ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-black text-base group-hover:text-primary transition-colors">
                                            {member.name}
                                        </h3>
                                        <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                member.available
                                                    ? 'bg-green-50 text-green-600'
                                                    : 'bg-gray-100 text-on-surface-variant'
                                            }`}
                                        >
                      {member.available ? '구직 중' : '구직 중단'}
                    </span>
                                    </div>

                                    <p className="text-xs text-on-surface-variant font-medium mb-1">{member.role}</p>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant mb-3">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-sm text-primary">star</span>
                      <span className="font-bold text-on-surface">{member.rating}</span>
                      <span>({member.reviewCount}개 리뷰)</span>
                    </span>
                                        <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                                            {member.location}
                    </span>
                                        <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-sm">work</span>
                                            {member.exp}
                    </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {member.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] font-bold bg-primary-soft text-primary px-2.5 py-0.5 rounded-full"
                                            >
                        {tag}
                      </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => removeScrap(member.id)}
                                        className="p-2 rounded-xl hover:bg-primary-soft transition-colors"
                                        title="스크랩 해제"
                                    >
                    <span
                        className="material-symbols-outlined text-primary text-xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bookmark
                    </span>
                                    </button>
                                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">
                      chat
                    </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 p-5 rounded-2xl bg-primary-soft/40 border border-primary/10 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5 text-sm">info</span>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                    북마크 아이콘을 클릭하면 스크랩이 해제됩니다. 채팅 아이콘을 누르면 해당 회원에게 메시지를 보낼 수 있습니다.
                </p>
            </div>
        </>
    );
}