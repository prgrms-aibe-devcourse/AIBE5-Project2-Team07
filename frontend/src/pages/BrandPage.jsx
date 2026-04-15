import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

const urgentBrandCards = [
  {
    alt: 'Coupang',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKBd_S7YDJEoLOex4wjnovV0UlZjXmY24fuuacAZKZuBt7B7SdRS6dItparhIfb3J1lfB5aGBqy3cTOlZqo_kT5pDbKm6sp9qqLoNAh9sf1hw4Apcl5u70TzasRGi7nzGIHpqhtqXXX-J_qRnIArc-rzkDTJTiipex6EpVYvjfU1wR_oeaAqqTvN2ZSZQlKfOSdOjPiSYbufWhhVx-xTtL3PbtRsp0Bd4xtotGejFlGYsKbzl8hSxLwnhTMoEXZbm-32JyQFCBwFg',
    icon: 'emergency',
    title: '쿠팡 풀필먼트',
    description: '전국 12개 물류센터 사원 즉시 모집',
    count: '142건 공고 진행중',
  },
  {
    alt: 'CU',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7dYMJ9nxxVR5-JsA_fIwcd2ics0-dCnG2hKr-OHcf55gGAHj_-zQ4ReTQlcGJMYYFKBmeO8C1nEWtZbmJZHlRq3QRQRRm5dDytNL-vmrRI0Fh8eIevO_3CMIR_bbQqVmUOrevWKOpjtkUzVlSsP1QUY22XDxKjfhwjf7odc_itGv7hwB7Wlxb2YuLd-y7Vj31LY4eeR9dWGEL-Os3yaLT455CLWmnMq18xMbga25CpL0LLL6Ay0Jggn1kTkOuXcF3_NYJ1YXnVS4',
    icon: 'alarm',
    title: 'CU 편의점',
    description: '야간 및 주말 대타 근무자 긴급 모집',
    count: '89건 공고 진행중',
  },
  {
    alt: 'Mega Coffee',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsmNiYIiJHNfu3d-zkBOxscvS23sWUY6RrD4--mkKm04iicFI-T8YS8ISL-mwsWQP83vuV3Q7VOccYrA-JDFqoGwNgvDvelpG3_5w7FpGEiTGgORV9ggbBPyAWCrGJ5QAcE0M7pEzXa2tsyEAII7Vfio7hpZuL6K44rmwOykwiaEWeMvclSduLXPrCvUZ585ohuUmUQIW1YoAzKOXWRCHrwImKG4atHNTzXPtXWJJI_RdEcwaVqB97b0BYwipqHPML2c-7-OLta_s',
    icon: 'local_cafe',
    title: '메가 MGC 커피',
    description: '수도권 주요 매장 바리스타 지원',
    count: '56건 공고 진행중',
  },
];

const allBrands = [
  {
    alt: 'Starbucks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4MjBb05ikvz3zIjtduvL3sIZskn9vkIaIcj03o-y7kxLAaK1X23EN_3d0oiLAnocxL4YoEg_4aZ2kTuvrNr2TchedMOYgrrpswjwOa1hm0b-vRBu8iPsIGfetg1nL7TTLUiEX5UdSZc19Yc5-kFXtKfYaL7PJvrFa44BkZZYUphRhm6AnYLRNOHqN6rHDk5JoHsIytuTitAnDkwZ5a2PU2pdJW4TuHizlrJy3WKz7gjZKl06zmdhka85mEQ5aYi5Kvw_ye_lwQdc',
    name: '스타벅스',
    category: '카페/바리스타',
    urgent: '12건 급구',
    normal: '45건 일반',
  },
  {
    alt: "McDonald's",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqkNlmEWfUg8B_Nd5Ba0oDsuLMY1mSbal2gwcHpF_F9NZ10TOBfNx-ik6eBzspDJfk7nGxmtoI-fxKRYusslQ_TZQ5tYtbTFbRoL0Ki7XrOPV804kOS_VX-00lIYbNvpaw0ObWcENeCZgriFcaQ4mLAM3Ypq9NJYKM2BR_-3-v_0dOAOnPEk1I9K3CUFQMoCYjB5USZ0ea9z5PdWsFEFbXPUpQXG5LyCkkQv3mOgB_A-Mneq4NnCzfL1xIVldx98dgTxQ9ZuiiZVU',
    name: '맥도날드',
    category: '푸드서비스',
    urgent: '34건 급구',
    normal: '112건 일반',
  },
  {
    alt: 'GS25',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrxvMANZaf39TUhIu9qAqcyRcyH4F7X6qmHAVQnVJ8ZJ4N37bUv9aKg2YoWx4OXJbG_-l5yLv5wid831a9SggGGa7dxAGRDiizbbXjyQLUFMqdIu2qTc3ImyenbnqwN1UualxuQSeR746V7d-0vI3ge0G_I7zKDvVhsczAk3gp5FZWKmvDQzc0oli8Xx_wXS_ZUvgQvcICscLn0xigVCNJ4U0sdW-xA3NQ4oDJUgVkNAaEIaii7alEele8IKpLHx3Dekr01zmeK5s',
    name: 'GS25',
    category: '리테일',
    urgent: '67건 급구',
    normal: '231건 일반',
  },
  {
    alt: 'Paris Baguette',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEf0NrtRUL-376Sn5YWFvvLRCkZvB6h9UiKlWz1jwSOi_MVe-8dxrQ1Ccc4YkGOcIoR35Agt412FXyYeovxkSxxa2DS_5E-itLrwUpti9aH76DcFtMV5Ko8JQ_ZvKRua-Mo9hPzi7kdZylE3Q_ayqOcodIRktMhJoGmJULCYMNCwl7rQs4T7AOMd9sK6H-F9NksnHnMf05ds3swQm5HfRhAUV2yGZQtYkLUkeRpcnyL908o0-smriHbpQBCoSyVkOUnvdX5M2knjc',
    name: '파리바게뜨',
    category: '베이커리',
    urgent: '18건 급구',
    normal: '54건 일반',
  },
  {
    alt: 'CJ Logistics',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp8eliAl6ozpYYlvzzFt69zKpkoDBEMZHzlNp0DEX-_jPYFfAptMWS73sgKBMCxMCypUiAjZZY3gKQ4J1SlE0M0pZ-WaMaJIS_L8woNCJ-StQOV0J6hlrpxDn_-ak99jm0HRrRdCBLLNvR75WLs8s0ct8PqqT5EDQMP05TSW6hjTb3AHq6pf3Gy-GjzRZ3rnFD5-JgZA6VhWTwHt0eNDL-yJM3o6Szl5Blelu4JQsU5tqYMy9vpkRvQG6XVo6ONhxO3HSEQAO6fX8',
    name: 'CJ대한통운',
    category: '물류/배송',
    urgent: '95건 급구',
    normal: '340건 일반',
  },
  {
    alt: 'Burger King',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUt7MsteV-6NIW9xU3lpHW6Yvn6KaQo5fTYzcfUJJ7mmxCVp9sow58OBBMqSaPc5fQB6VizFYsNpW4WLGNYDBvzif56kqGgUoNEIVjWUsuwElpYS6ZHyKAcpG7Ujyv9O6OfO-U4w4GOA_aYqXk3FI-8VS0p3GWeafRbVvislLISanDughSDpTfSrH7lLt8B70rXb4vzOdFFplnhIa4nmDFIE8tDO-VwZxjn2k0dc5XHPJdvin96So29RdWjr2ScXooLAIhrSuh-4Q',
    name: '버거킹',
    category: '푸드서비스',
    urgent: '15건 급구',
    normal: '88건 일반',
  },
  {
    alt: 'Subway',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtuBsXcaCJZVYd4seuNCXsSQk1ZCy-hJNs23DFJTg6QGUJYBhg2INYgfWDuExLBLy8nP6o60ck8BAi0isTZohnou3ZOZ8Y0UFSAT2YeCxF4i2nTq8s3EU-KJVzNuMNPLyhDLTJsx-NtnmsWOKayzyE2iGtcRpS-BdDxlWyBn2f0YOx3eiOyZenn0VEV5rQuntqmnfrON5dYvQM9UZWYfKxkazGi8Mn_UNtP-LCnHeU1qjcb-6MzYpFnDH6vC-iyfd_44NnrexhPeM',
    name: '써브웨이',
    category: '푸드서비스',
    urgent: '22건 급구',
    normal: '61건 일반',
  },
  {
    alt: 'Lotteria',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2bbvoZ3Ol4GCb_eVfM6gbipoCBrGt--3JPMjoyf0H57n_vNnaGi4JV2vQSApTFOsjMaiTRH79Pjhd_6IRoMAON4XLZFghcH_Nfs_cFQSAxHYd9TQHc_KJAFNpImAgJ9RXaUP3aBbKaQkPQS2a3sVRizrJi-3PCUW5NKnExT0ZxgSRateDm1_Rz7akFHUb8lbPUAttOPzCdKwnQcTKck5LcjLusIWqZAailhEC53IdnPviv3no2P7v7TPUQGdo2-b-xVnOkT6G6cc',
    name: '롯데리아',
    category: '푸드서비스',
    urgent: '29건 급구',
    normal: '72건 일반',
  },
];

export default function BrandPage() {
  const navigate = useNavigate();

  return (
    <>
      <TopNavBar />
      <main className="pt-20">
        <section className="py-16 text-center">
          <div className="custom-container">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-10 text-on-surface">글로벌 브랜드 탐색</h1>
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant">search</span>
              </div>
              <input
                className="w-full bg-[#f9f9f9] border-none focus:ring-2 focus:ring-primary/20 rounded-2xl py-6 pl-16 pr-28 text-xl font-medium transition-all placeholder:text-on-surface-variant/50 shadow-sm"
                placeholder="브랜드 검색 (예: 스타벅스, 쿠팡)"
                type="text"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <CommonButton size="sm" className="px-4 py-2.5 text-xs">검색</CommonButton>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="custom-container">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-full mb-3 tracking-tight">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
                    notifications_active
                  </span>
                  긴급 채용 브랜드
                </span>
                <h2 className="text-3xl font-extrabold tracking-tighter">실시간 급구 브랜드</h2>
              </div>
              <button className="flex items-center gap-1 text-primary font-bold hover:underline underline-offset-4 transition-all">
                실시간 업데이트 <span className="material-symbols-outlined">trending_up</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {urgentBrandCards.map((card) => (
                <div
                  key={card.title}
                  className="group bg-white rounded-2xl overflow-hidden transition-all shadow-md hover:shadow-xl hover:-translate-y-1 border border-outline/30"
                >
                  <div className="h-48 overflow-hidden bg-primary-soft relative">
                    <img
                      alt={card.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={card.image}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-primary flex items-center shadow-sm">
                      <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: '"FILL" 1' }}>
                        {card.icon}
                      </span>
                      <span className="text-xs font-bold">급구</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{card.title}</h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed">{card.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t border-outline/50">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary text-white text-xs font-black shadow-sm">
                        {card.count}
                      </span>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f9f9f9]">
          <div className="custom-container">
            <div className="mb-12">
              <h2 className="text-3xl font-extrabold tracking-tighter mb-2">전체 브랜드 탐색</h2>
              <p className="text-on-surface-variant font-medium">250여 개의 프리미엄 파트너사를 확인해보세요.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allBrands.map((brand) => (
                <div
                  key={brand.name}
                  className="bg-white p-6 rounded-xl flex items-center justify-between hover:shadow-md transition-all border border-outline/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f9f9f9] rounded-full flex items-center justify-center border border-outline/50 overflow-hidden">
                      <img alt={brand.alt} className="w-8 h-8 object-contain" src={brand.image} />
                    </div>
                    <div>
                      <span className="font-bold block text-sm">{brand.name}</span>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{brand.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-primary font-bold block text-xs">{brand.urgent}</span>
                    <span className="text-on-surface-variant text-[10px]">{brand.normal}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 flex justify-center">
              <CommonButton
                variant="outline"
                size="xl"
                onClick={() => navigate('/brand/recruits')}
                icon={<span className="material-symbols-outlined text-lg">add</span>}
              >
                전체 브랜드 보기
              </CommonButton>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />

      <MobileBottomNav />
    </>
  );
}
