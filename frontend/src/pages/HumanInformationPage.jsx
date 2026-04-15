import React, { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

const premiumTalents = [
  {
    name: '김민수',
    rating: 4.9,
    experience: '경력 5년 3개월 · 카페 바리스타',
    location: '서울 강남구 전지역',
    tags: ['#영어가능', '#보건증소지'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuArunN_olGkZSUoydiSUq0VzjWUGoDaAlVcpaSzDWLVI0V_hF26fu1UTj_x4Y_zoNhkqf3LNGzF0Ix3IA94b8vsJakSoaTZuWwiNVe4XSG7NEzFKV4L1NA2oFiMG8FnWz3YaIslHV87wFG5Sr2ez_KSUbC5m45YJvvj0KUjNpIaMJvcmHKmcQVf_7jENbKUn8Vv0_mu3FZdJisKCE4ydkrTRfMj95oz2l4nGoOTF5Z6yqQrF8kgam36MW5LVnvzSplN4b57XKckuLg',
  },
  {
    name: '이서윤',
    rating: 5.0,
    experience: '경력 3년 · 컨벤션 리셉션',
    location: '서울 마포·서대문',
    tags: ['#친절매너', '#정장소지'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeL2oSeqzSISSJtgD0uv0FUBA_cjvaIfseCK8-poH6GA-3Ro3AOYyyUWg3W2ktJGNdaLvIXe1S0OJUhtXo2ccKI4MzEX4c2m5CfU7M1KiGaa026B_kcs10pD1TOS1vB80mKzfFSpItYJL-V17WVK_c_x-oDfU_Cb_uJVBsXKYG5It80KKckV2ckjZ7xqZMAW94v4irF_GxGXaB3WL0_sgYhe2fctGcxkI70iJ4x0ZzIeFSV6MKMHmOiyqlaIcMq8m2MojeNo3C2Dk',
  },
  {
    name: '박진우',
    rating: 4.8,
    experience: '경력 8년 · 베테랑 셰프',
    location: '경기 분당·판교',
    tags: ['#베테랑', '#칼질능숙'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5KwGPXMepx5X3t7sCFQ_JtQMp6_b--2dzFfrbULJi52efHUDzm8He2A6mRo1oikWwJSHKbgIM6k08H57LaupzXAQbAlfNIrlBn4DFeRKBvlLMF2vktoCzlKn_pTQ9t1JGAQzUNcnK_Sg4d8GHAX1-eqHs39uJS6l3DiUEqXKFWpH0-BrQTG6QAxx-qRjELuykElTmO-m5bQNY79AGkAfRYo8ZYfQvCi5ZVI15PPVfvwi1zX2ElH0qlJiWhFAGFW-Jh31OlW1cdtA',
  },
  {
    name: '최유진',
    rating: 4.9,
    experience: '경력 2년 · 피팅매장 판매',
    location: '서울 강남·서초',
    tags: ['#판매왕', '#밝은성격'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvsohhyoQXE5qnOIIN38jiSfFzUFZujzpiU8GV-xFMBxXlA4zSZBEx1K-GOO37PtBa7oxN_7Ivwcib80Js3G1Xjz2Py7wrYocV5-wa0TXoDVrgZBRhk1fmPRzzFHT1QwF3eZjuyE7e685sqPgT42sgjli8Zko-be1pzUav8ajwmUuF3_uGcqhoPg6_CPQ5fMVhoK-8P_RDnYII0EMddseixZ3zsM4n_rahg47coQGFB5Qub0skT3VKh9ErnjSBVIxkj4JZXMjh4mI',
  },
];

const talentList = [
  {
    name: '정한결',
    rating: 4.7,
    status: '활동중',
    location: '강남구 · 역삼동',
    job: '희망: 배달 · 물류 · 운전',
    experience: '경력 4년 2개월',
    activeResponse: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_XhYdmR6qXF3-vwbIM2chfgViThiOqRAWTxqAtrRCYw6jLOMxyjLAQ4J6uBHv36npuA6PDU8FO53p91K8SdtVc0E6_iC0fcaCfm1t-AWQlZ79mw0JbqwctByAgeKUXu1gGy-Dx6B9OxrSty_e6RKzmeFAs_di9m-D3Gh9yVSNKjJXQsQnI-ZT7rlc0tmu_0ZZ4ZreYjeoggeL6TZ9BDxlRgeAyNCKcvKAA9HguOBc4RqKww3pWO7Bzz7Jwr3j3pLtyMC1ZIUfcKc',
  },
  {
    name: '이지은',
    rating: 4.9,
    status: '활동중',
    location: '마포구 · 서교동',
    job: '희망: 홀서빙 · 주방보조',
    experience: '신입',
    activeResponse: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXHwyWLng1LHsd0Qr61B0Ek7YcqRU1y2hlD093z4rJ9tDhrYT8DYHNwJn1h4OQnfaK59NA7ga_-862qWdCAYZ86ZS8-PqlzA5Hxw4ERX103y_zRpapMGVTMr55oz4YLpxeyrE9-NGWclf0aCZ9WdUs6biBrcr1ZGkMNtqpuBTOv0EvddCVpXezrKTy0TwM9XfL0zkp-5f_y-k7dzw24He3Bj9tPlNZH73eF5GkGHKcaASMpY1RgztOIVLXB2clfLKoo76cDdFVdeM',
  },
  {
    name: '장준호',
    rating: 5.0,
    status: '베테랑',
    location: '서초구 · 반포동',
    job: '희망: 주방장 · 매니징',
    experience: '경력 12년',
    activeResponse: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCukrr68GI0dFfnTx-ZlBjubPJ445yiwuyTeRXhD7EGeRsynwlLvubXZrJams7Tc8ukO7DFTmToy1BgdC0Euyi-Dufu1kyf5JzxD0Hpm5wVSaeXUTDmFFvSuhCCCXAGCeoPLA-aHhQ9CrDyhZYHDC9msycnvSABzDLX8KcIEndRZWKOEx9y_OmFRmKScseK_nja6RibBjRrl2YSlGXXiQpaeWigQ756RqlkeeeZ_GL4-WCVzO0GmievdZuxCmHRPv_J4sMVQHd0wG8',
  },
  {
    name: '최민아',
    rating: 4.8,
    status: '활동중',
    location: '강남구 · 삼성동',
    job: '희망: 행사 스탭 · 리셉션',
    experience: '경력 2년',
    activeResponse: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeL2oSeqzSISSJtgD0uv0FUBA_cjvaIfseCK8-poH6GA-3Ro3AOYyyUWg3W2ktJGNdaLvIXe1S0OJUhtXo2ccKI4MzEX4c2m5CfU7M1KiGaa026B_kcs10pD1TOS1vB80mKzfFSpItYJL-V17WVK_c_x-oDfU_Cb_uJVBsXKYG5It80KKckV2ckjZ7xqZMAW94v4irF_GxGXaB3WL0_sgYhe2fctGcxkI70iJ4x0ZzIeFSV6MKMHmOiyqlaIcMq8m2MojeNo3C2Dk',
  },
  {
    name: '박지현',
    rating: 4.9,
    status: '베테랑',
    location: '송파구 · 잠실동',
    job: '희망: 카페 매니저',
    experience: '경력 6년 5개월',
    activeResponse: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvsohhyoQXE5qnOIIN38jiSfFzUFZujzpiU8GV-xFMBxXlA4zSZBEx1K-GOO37PtBa7oxN_7Ivwcib80Js3G1Xjz2Py7wrYocV5-wa0TXoDVrgZBRhk1fmPRzzFHT1QwF3eZjuyE7e685sqPgT42sgjli8Zko-be1pzUav8ajwmUuF3_uGcqhoPg6_CPQ5fMVhoK-8P_RDnYII0EMddseixZ3zsM4n_rahg47coQGFB5Qub0skT3VKh9ErnjSBVIxkj4JZXMjh4mI',
  },
  {
    name: '이동욱',
    rating: 4.6,
    status: '활동중',
    location: '종로구 · 혜화동',
    job: '희망: 편의점 · 마트',
    experience: '경력 1년 2개월',
    activeResponse: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuArunN_olGkZSUoydiSUq0VzjWUGoDaAlVcpaSzDWLVI0V_hF26fu1UTj_x4Y_zoNhkqf3LNGzF0Ix3IA94b8vsJakSoaTZuWwiNVe4XSG7NEzFKV4L1NA2oFiMG8FnWz3YaIslHV87wFG5Sr2ez_KSUbC5m45YJvvj0KUjNpIaMJvcmHKmcQVf_7jENbKUn8Vv0_mu3FZdJisKCE4ydkrTRfMj95oz2l4nGoOTF5Z6yqQrF8kgam36MW5LVnvzSplN4b57XKckuLg',
  },
];

export default function HumanInformationPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSearchPage, setShowSearchPage] = useState(false);

  return (
    <>
      <TopNavBar />

      {!showSearchPage ? (
        <main className="pt-32 pb-24 space-y-24">
          <section className="flex flex-col items-center space-y-10 py-10 custom-container">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface text-center">
              원하는 인재를 <span className="text-primary">지금 바로</span> 찾아보세요
            </h1>

            <div className="w-full max-w-4xl space-y-6">
              <div className="relative group flex items-center">
                <input
                  className="w-full h-16 pl-14 pr-32 bg-white border border-outline rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                  placeholder="희망업종, 지역 또는 이름으로 검색"
                  type="text"
                />
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant text-2xl">
                  search
                </span>
                <button
                  onClick={() => setShowSearchPage(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-8 h-12 rounded-lg font-bold text-base hover:bg-primary-deep transition-colors shadow-sm"
                >
                  검색
                </button>
              </div>

              <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setShowSearchPage(true)}
                  className="px-6 py-2.5 rounded-full bg-primary text-white font-bold text-xs shadow-sm"
                >
                  전체
                </button>
                <button
                  onClick={() => setShowSearchPage(true)}
                  className="px-6 py-2.5 rounded-full bg-white border border-outline text-on-surface-variant font-bold text-xs hover:border-primary transition-colors"
                >
                  실시간 활동
                </button>
                <button
                  onClick={() => setShowSearchPage(true)}
                  className="px-6 py-2.5 rounded-full bg-white border border-outline text-on-surface-variant font-bold text-xs hover:border-primary transition-colors"
                >
                  베테랑 인재
                </button>
                <button
                  onClick={() => setShowSearchPage(true)}
                  className="px-6 py-2.5 rounded-full bg-white border border-outline text-on-surface-variant font-bold text-xs hover:border-primary transition-colors"
                >
                  브랜드 경력
                </button>
              </div>
            </div>
          </section>

          <section className="custom-container space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter">오늘의 프리미엄 인재</h2>
                <p className="text-on-surface-variant font-medium mt-2">지금 즉시 업무 투입이 가능한 긴급 출근 대기 인재입니다.</p>
              </div>
              <button className="text-primary font-bold flex items-center gap-1 group py-2">
                전체보기 <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumTalents.map((talent) => (
                <div key={talent.name} className="bg-white rounded-xl p-6 border border-outline transition-all hover:shadow-md hover:-translate-y-1 relative">
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                      로켓 출근
                    </span>
                  </div>
                  <div className="mb-5 h-20 w-20 rounded-xl overflow-hidden bg-gray-100">
                    <img alt={talent.name} className="w-full h-full object-cover" src={talent.image} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{talent.name}</span>
                      <div className="flex items-center gap-0.5 text-primary text-xs font-bold">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {talent.rating}
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-xs font-semibold">{talent.experience}</p>
                    <div className="pt-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {talent.location}
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        {talent.tags.map((tag) => (
                          <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-[10px] font-semibold text-on-surface-variant">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="custom-container space-y-10">
            <div className="flex items-center justify-between border-b border-outline pb-4">
              <h2 className="text-2xl font-extrabold tracking-tighter">오늘의 인재 <span className="text-primary">1,234명</span></h2>
              <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
                <button className="text-on-surface border-b-2 border-primary pb-4 -mb-[18px]">최신순</button>
                <button className="hover:text-on-surface pb-4">경력순</button>
                <button className="hover:text-on-surface pb-4">별점순</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {talentList.map((talent) => (
                <div key={talent.name} className="bg-white p-6 rounded-xl border border-outline flex flex-col gap-5 group cursor-pointer hover:shadow-md transition-all" onClick={() => setShowSearchPage(true)}>
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      <img alt={talent.name} className="w-full h-full object-cover" src={talent.image} />
                    </div>
                    <div className="flex items-center text-primary">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold ml-1">{talent.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold">{talent.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${talent.status === '베테랑' ? 'bg-primary text-white' : 'bg-primary-soft text-primary'}`}>
                        {talent.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-on-surface-variant font-medium">
                      <p className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>{talent.location}</p>
                      <p className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">work</span>{talent.job}</p>
                      <p className="font-bold text-on-surface mt-1">{talent.experience}</p>
                    </div>
                    {talent.activeResponse && (
                      <div className="flex items-center gap-1 text-primary text-[10px] font-extrabold">
                        <span className="material-symbols-outlined text-sm">chat</span> 알바제의 적극응답
                      </div>
                    )}
                  </div>
                  <button className="w-full bg-gray-100 text-on-surface py-2.5 rounded-lg font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">프로필 열람</button>
                </div>
              ))}
            </div>
          </section>
        </main>
      ) : (
        <main className="pt-28">
          <section className="pb-10">
            <div className="custom-container">
              <div className="mb-6">
                <button onClick={() => setShowSearchPage(false)} className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="material-symbols-outlined">arrow_back</span>
                  돌아가기
                </button>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex gap-10 border-b border-outline overflow-x-auto scrollbar-hide">
                  <button className="pb-4 text-lg font-bold border-b-4 border-primary text-on-surface whitespace-nowrap">전체인재</button>
                  <button className="pb-4 text-lg font-bold border-b-4 border-transparent text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">실시간 활동인재</button>
                  <button className="pb-4 text-lg font-bold border-b-4 border-transparent text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">베테랑 인재</button>
                  <button className="pb-4 text-lg font-bold border-b-4 border-transparent text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">브랜드 경력 인재</button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-grow flex items-center bg-white border border-outline rounded-xl px-4 py-2 shadow-sm focus-within:border-primary transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
                    <input className="w-full border-none focus:ring-0 text-sm font-medium" placeholder="지역, 업종, 또는 인재명을 입력하세요" type="text" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#f2efee] rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">지역별 <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span></button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#f2efee] rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">업종별 <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span></button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#f2efee] rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">리뷰 점수별 <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span></button>
                    <button className="flex items-center gap-1 px-4 py-2 text-primary text-xs font-bold ml-2"><span className="material-symbols-outlined text-sm">restart_alt</span> 필터 초기화</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white py-10">
            <div className="custom-container">
              <div className="flex items-end justify-between mb-8">
                <h3 className="text-2xl font-extrabold tracking-tighter">대기중인 인재 <span className="text-primary">2,481명</span></h3>
                <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
                  <button className="text-on-surface">최신순</button>
                  <span className="text-outline">|</span>
                  <button className="hover:text-on-surface">별점순</button>
                  <span className="text-outline">|</span>
                  <button className="hover:text-on-surface">경력순</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {talentList.map((talent) => (
                  <div key={`search-${talent.name}`} className="bg-white rounded-xl p-6 border border-outline transition-all hover:shadow-lg hover:-translate-y-1 relative group">
                    <div className="mb-5 h-20 w-20 rounded-xl overflow-hidden bg-gray-100">
                      <img alt={talent.name} className="w-full h-full object-cover" src={talent.image} />
                    </div>
                    <div className="space-y-1.5 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{talent.name}</span>
                        <div className="flex items-center gap-0.5 text-primary text-xs font-bold">
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>{talent.rating}
                        </div>
                      </div>
                      <p className="text-on-surface-variant text-xs font-semibold">{talent.experience}</p>
                      <div className="pt-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium">
                          <span className="material-symbols-outlined text-sm">location_on</span>{talent.location}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setShowLoginModal(true)} className="w-full py-3 bg-gray-50 text-on-surface font-bold rounded-lg group-hover:bg-primary group-hover:text-white transition-colors text-sm">제의하기</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      <AppFooter />

      <div className={`${showLoginModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}>
        <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
        <div className="relative bg-white w-full max-w-md p-10 rounded-2xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          </div>
          <h5 className="text-2xl font-bold mb-3">기업회원 전용 메뉴입니다</h5>
          <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">상세한 인재 프로필 정보 열람과<br />알바 제의는 기업회원 로그인 후 가능합니다.</p>
          <div className="w-full flex flex-col gap-3">
            <CommonButton size="full">기업회원 로그인</CommonButton>
            <CommonButton variant="subtle" size="full">기업회원 가입하기</CommonButton>
          </div>
          <button className="mt-6 text-on-surface-variant text-sm font-bold underline decoration-outline underline-offset-4" onClick={() => setShowLoginModal(false)}>닫기</button>
        </div>
      </div>
    </>
  );
}
