import React from 'react';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

const brandTabs = ['전체', 'CU', 'GS25', '세븐일레븐', '이마트24', '미니스톱'];

const urgentJobs = [
  {
    brand: 'CU 강남대로점',
    title: '주말 야간 스태프 모집 (경력자 우대)',
    location: '서울 강남구 역삼동',
    payLabel: '시급',
    pay: '11,000원',
    schedule: '토,일 22:00 ~ 08:00',
    posted: '등록: 10분 전',
    urgent: true,
    icon: 'notifications_active',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwQhu8R3USr7Do0KqdLjxfoFdwpLmZxwdfQj5CYnkQpnQpy5k0spCFEpIQ6mf_F0yXkMDbwkh3CVNtFP1Cn4OzuR7ILlbGFXitLqicgkQ1K40kNlmRayRs36d7s7oBjC4awcCPLwNlbNnlsTxu1WKgtf7lhxFQWQ6pG7keML8AXIFP55pbH8X0NTx8WGPn-0qBE6S4y5z56Kklr2FYlxr1AtFUbHgPeweSkh4GU7iYyate1-adqpEt4P2IcZU13XSWWxaNxBKzsZI',
  },
  {
    brand: 'CU 마포합정점',
    title: '평일 오전 타임 성실하신 분 구합니다',
    location: '서울 마포구 합정동',
    payLabel: '시급',
    pay: '9,860원',
    schedule: '월~금 08:00 ~ 14:00',
    posted: '등록: 1시간 전',
    urgent: false,
    icon: 'bookmark',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa-D0K4h6OCzTjD9pul2MiJF88ceWnXR-sStaqWWOmIH0OdCxMLFsZ-N4bgA3QgGjkcJ4m_f6QVd6OAv9NBDNpN6A1gdgwh8zBx_x_qhocm-qHTcemt3m0y2x4XT_i21JRYahuR_0k4ywkIE7DW37Y_5d2rXdcPxRh4owNYDPb98EU2wTQqgaMQrqZQWvNV5AsGw0WQiZTZyuQ8a1ORL0lIuspNby9vyLGnSXYmM8TYjB3Isvug2UMKjw2LpZmFmoHGRIySICjuLI',
  },
  {
    brand: 'CU 성수베이커리점',
    title: '오늘 야간 땜빵 구함 (경력필수)',
    location: '서울 성동구 성수동',
    payLabel: '일급',
    pay: '120,000원',
    schedule: '금 23:00 ~ 08:00',
    posted: '등록: 방금 전',
    urgent: true,
    icon: 'notifications_active',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo4JWIYDTSW25sLKU8x5RZfkuosk6WYpl_fGerkGXlzyaFTqHpQcKYaqlK2cobQsWMjGyxM_H6RY3GCFDWZ-SxEXghZouunPw6lgixfs-_dP0KqVTyB4SjzLGkiJkPcKoV72ONmzhOHtCSOD9MSR41B3tyKXNtHKUuQf6j5L0D64pcbRjMAjKgZnSxawtBFbjqQrz6M_v4JKl2ePYljuDHoSQZooIS_sewARZaCe_T8vfvEf5ZmzElYDjXhLbdXp9veCAbWkicmc0',
  },
  {
    brand: 'CU 잠실월드점',
    title: '저녁 피크타임 계산/진열 스태프 모집',
    location: '서울 송파구 잠실동',
    payLabel: '시급',
    pay: '10,200원',
    schedule: '월~금 17:00 ~ 23:00',
    posted: '등록: 35분 전',
    urgent: false,
    icon: 'bookmark',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwQhu8R3USr7Do0KqdLjxfoFdwpLmZxwdfQj5CYnkQpnQpy5k0spCFEpIQ6mf_F0yXkMDbwkh3CVNtFP1Cn4OzuR7ILlbGFXitLqicgkQ1K40kNlmRayRs36d7s7oBjC4awcCPLwNlbNnlsTxu1WKgtf7lhxFQWQ6pG7keML8AXIFP55pbH8X0NTx8WGPn-0qBE6S4y5z56Kklr2FYlxr1AtFUbHgPeweSkh4GU7iYyate1-adqpEt4P2IcZU13XSWWxaNxBKzsZI',
  },
  {
    brand: 'CU 홍대입구점',
    title: '주말 심야 근무 가능자 우대 채용',
    location: '서울 마포구 서교동',
    payLabel: '시급',
    pay: '11,500원',
    schedule: '토,일 00:00 ~ 08:00',
    posted: '등록: 5분 전',
    urgent: true,
    icon: 'notifications_active',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa-D0K4h6OCzTjD9pul2MiJF88ceWnXR-sStaqWWOmIH0OdCxMLFsZ-N4bgA3QgGjkcJ4m_f6QVd6OAv9NBDNpN6A1gdgwh8zBx_x_qhocm-qHTcemt3m0y2x4XT_i21JRYahuR_0k4ywkIE7DW37Y_5d2rXdcPxRh4owNYDPb98EU2wTQqgaMQrqZQWvNV5AsGw0WQiZTZyuQ8a1ORL0lIuspNby9vyLGnSXYmM8TYjB3Isvug2UMKjw2LpZmFmoHGRIySICjuLI',
  },
  {
    brand: 'CU 광화문점',
    title: '오전 오픈조 상품 진열 담당',
    location: '서울 종로구 세종로',
    payLabel: '시급',
    pay: '10,030원',
    schedule: '월~금 06:30 ~ 12:30',
    posted: '등록: 2시간 전',
    urgent: false,
    icon: 'bookmark',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo4JWIYDTSW25sLKU8x5RZfkuosk6WYpl_fGerkGXlzyaFTqHpQcKYaqlK2cobQsWMjGyxM_H6RY3GCFDWZ-SxEXghZouunPw6lgixfs-_dP0KqVTyB4SjzLGkiJkPcKoV72ONmzhOHtCSOD9MSR41B3tyKXNtHKUuQf6j5L0D64pcbRjMAjKgZnSxawtBFbjqQrz6M_v4JKl2ePYljuDHoSQZooIS_sewARZaCe_T8vfvEf5ZmzElYDjXhLbdXp9veCAbWkicmc0',
  },
  {
    brand: 'CU 강서공항점',
    title: '공항 인근 새벽 근무자 즉시 채용',
    location: '서울 강서구 공항동',
    payLabel: '시급',
    pay: '12,000원',
    schedule: '월~일 04:00 ~ 10:00',
    posted: '등록: 12분 전',
    urgent: true,
    icon: 'notifications_active',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwQhu8R3USr7Do0KqdLjxfoFdwpLmZxwdfQj5CYnkQpnQpy5k0spCFEpIQ6mf_F0yXkMDbwkh3CVNtFP1Cn4OzuR7ILlbGFXitLqicgkQ1K40kNlmRayRs36d7s7oBjC4awcCPLwNlbNnlsTxu1WKgtf7lhxFQWQ6pG7keML8AXIFP55pbH8X0NTx8WGPn-0qBE6S4y5z56Kklr2FYlxr1AtFUbHgPeweSkh4GU7iYyate1-adqpEt4P2IcZU13XSWWxaNxBKzsZI',
  },
  {
    brand: 'CU 노원중계점',
    title: '평일 오후 파트타이머 모집',
    location: '서울 노원구 중계동',
    payLabel: '시급',
    pay: '9,900원',
    schedule: '월~금 14:00 ~ 20:00',
    posted: '등록: 3시간 전',
    urgent: false,
    icon: 'bookmark',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa-D0K4h6OCzTjD9pul2MiJF88ceWnXR-sStaqWWOmIH0OdCxMLFsZ-N4bgA3QgGjkcJ4m_f6QVd6OAv9NBDNpN6A1gdgwh8zBx_x_qhocm-qHTcemt3m0y2x4XT_i21JRYahuR_0k4ywkIE7DW37Y_5d2rXdcPxRh4owNYDPb98EU2wTQqgaMQrqZQWvNV5AsGw0WQiZTZyuQ8a1ORL0lIuspNby9vyLGnSXYmM8TYjB3Isvug2UMKjw2LpZmFmoHGRIySICjuLI',
  },
  {
    brand: 'CU 성남판교점',
    title: '주중 야간 담당자 긴급 구인',
    location: '경기 성남시 분당구',
    payLabel: '시급',
    pay: '11,200원',
    schedule: '월~금 22:00 ~ 06:00',
    posted: '등록: 20분 전',
    urgent: true,
    icon: 'notifications_active',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo4JWIYDTSW25sLKU8x5RZfkuosk6WYpl_fGerkGXlzyaFTqHpQcKYaqlK2cobQsWMjGyxM_H6RY3GCFDWZ-SxEXghZouunPw6lgixfs-_dP0KqVTyB4SjzLGkiJkPcKoV72ONmzhOHtCSOD9MSR41B3tyKXNtHKUuQf6j5L0D64pcbRjMAjKgZnSxawtBFbjqQrz6M_v4JKl2ePYljuDHoSQZooIS_sewARZaCe_T8vfvEf5ZmzElYDjXhLbdXp9veCAbWkicmc0',
  },
  {
    brand: 'CU 인천송도점',
    title: '주말 오전 계산대/청결 담당',
    location: '인천 연수구 송도동',
    payLabel: '시급',
    pay: '10,100원',
    schedule: '토,일 09:00 ~ 15:00',
    posted: '등록: 1일 전',
    urgent: false,
    icon: 'bookmark',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwQhu8R3USr7Do0KqdLjxfoFdwpLmZxwdfQj5CYnkQpnQpy5k0spCFEpIQ6mf_F0yXkMDbwkh3CVNtFP1Cn4OzuR7ILlbGFXitLqicgkQ1K40kNlmRayRs36d7s7oBjC4awcCPLwNlbNnlsTxu1WKgtf7lhxFQWQ6pG7keML8AXIFP55pbH8X0NTx8WGPn-0qBE6S4y5z56Kklr2FYlxr1AtFUbHgPeweSkh4GU7iYyate1-adqpEt4P2IcZU13XSWWxaNxBKzsZI',
  },
];

export default function BrandRecruitExplorePage() {
  return (
    <>
      <TopNavBar />

      <main className="pt-20 bg-white">
        <section className="bg-white pt-10 pb-8">
          <div className="custom-container">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden">
              <img
                alt="Brand Banner"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7aahMbscZEcQiq4_6unnUWXiMV0dK7fNcgc0zYKstgQzypeR15zuMUV5zD9MFax5dYsBRxmREqMraNugxDGo2rPPx_7oIyqX6O-o9YEsNUhy1dDLkFcQMYUpwSXDbh_6mYaU_LlNdCTqtkxwXmAhTM-MaGnctweFYy-OVaeiNyara11hxz7M-Scd5WdmAnYfB2eSop48UQAeZ3icuv-Cyr4meo1XJ1wa2W8Ett1DqhGHw1rUYYJgsAW3_8zsQ7gfA7Ka2C_4Yqwo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10 flex items-end gap-6">
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-3 shadow-lg">
                  <img
                    alt="CU Logo"
                    className="w-full h-auto"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZj6CXaxLTJvMUS4qDtpyp6HHfa63qY6_CmaKWCpaBy1g08xaKBTSKm5aLfwZFoiUONhdxcxStuPb4XSVLtOl3-tdcg_AiXWeKLOwX6AqPDKCsGCpc83szQ2SuT5_gZ55CS14zv5V7atbvg6mKRvKbwExaQ9kpNpqaUEBTXc6rK0GKO3iTkXf613gYtL8gDbyomXRsI8zD7SArOgP48UEkgG7nOQ4WShSW1KHPBGF3f5Wvh9gIfUQ88pzuYBMh-nw7TpeR8FDQ-q8"
                  />
                </div>
                <div className="mb-1 text-white">
                  <h1 className="text-4xl font-black tracking-tight">CU</h1>
                  <p className="text-white/80 text-base font-medium mt-1">전국 16,000여 개의 일상을 함께하는 1등 편의점</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center p-6 bg-white border-[0.5px] border-outline rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <button className="flex items-center gap-2 text-on-surface-variant font-bold text-sm hover:text-primary transition-colors">
                브랜드 상세정보 보기
                <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="bg-primary-soft text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-primary/10">진행중 공고 4,291</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f9f9f9] py-10">
          <div className="custom-container space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <div className="bg-white border-[0.5px] border-outline p-4 rounded-xl flex justify-between items-center cursor-pointer group shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                  <span className="font-bold text-on-surface">편의점</span>
                  <span className="material-symbols-outlined text-primary group-hover:rotate-180 transition-transform">expand_more</span>
                </div>
              </div>
              <div className="md:col-span-9 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {brandTabs.map((tab, index) => (
                  <button
                    key={tab}
                    className={`px-7 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
                      index === 0
                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                        : 'bg-white border border-outline text-on-surface hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border-[0.5px] border-outline p-6 rounded-2xl flex flex-wrap items-center gap-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-background border border-outline rounded-lg text-sm font-bold text-on-surface-variant hover:border-primary/30 transition-colors">
                지역
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-background border border-outline rounded-lg text-sm font-bold text-on-surface-variant hover:border-primary/30 transition-colors">
                근무조건
                <span className="material-symbols-outlined text-sm">tune</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-background border border-outline rounded-lg text-sm font-bold text-on-surface-variant hover:border-primary/30 transition-colors">
                상세조건
                <span className="material-symbols-outlined text-sm">filter_list</span>
              </button>
              <div className="ml-auto flex items-center gap-3">
                <label className="relative flex items-center cursor-pointer gap-2">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-6 h-6 border-2 border-outline rounded-md flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-all">
                    <span className="material-symbols-outlined text-[16px] text-white hidden peer-checked:block">check</span>
                  </div>
                  <span className="text-sm font-bold text-primary">급구만 보기</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-[0.5px] border-outline shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-hidden grid grid-cols-3 h-72">
              <div className="bg-[#f9f9f9] overflow-y-auto border-r border-outline">
                <div className="p-4 font-bold text-primary bg-white border-r-4 border-primary">서울특별시</div>
                <div className="p-4 text-sm font-medium text-on-surface-variant hover:bg-white transition-colors cursor-pointer">경기도</div>
                <div className="p-4 text-sm font-medium text-on-surface-variant hover:bg-white transition-colors cursor-pointer">인천광역시</div>
                <div className="p-4 text-sm font-medium text-on-surface-variant hover:bg-white transition-colors cursor-pointer">강원도</div>
                <div className="p-4 text-sm font-medium text-on-surface-variant hover:bg-white transition-colors cursor-pointer">충청북도</div>
              </div>
              <div className="bg-white overflow-y-auto border-r border-outline">
                <div className="p-4 text-sm font-medium text-on-surface-variant hover:bg-[#f9f9f9] transition-colors cursor-pointer">강남구</div>
                <div className="p-4 font-bold text-on-surface bg-[#f9f9f9]">강동구</div>
                <div className="p-4 text-sm font-medium text-on-surface-variant hover:bg-[#f9f9f9] transition-colors cursor-pointer">강북구</div>
                <div className="p-4 text-sm font-medium text-on-surface-variant hover:bg-[#f9f9f9] transition-colors cursor-pointer">강서구</div>
              </div>
              <div className="bg-white overflow-y-auto">
                <div className="p-4 text-sm font-medium text-on-surface-variant hover:bg-[#f9f9f9] transition-colors cursor-pointer">전체</div>
                <div className="p-4 text-sm font-medium text-on-surface-variant hover:bg-[#f9f9f9] transition-colors cursor-pointer">강일동</div>
                <div className="p-4 font-bold text-on-surface bg-[#f9f9f9]">고덕동</div>
                <div className="p-4 text-sm font-medium text-on-surface-variant hover:bg-[#f9f9f9] transition-colors cursor-pointer">길동</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="custom-container">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter">공고 <span className="text-primary">1,248</span>건</h2>
              </div>
              <div className="flex gap-2 bg-outline/20 p-1 rounded-lg">
                <button className="px-5 py-1.5 bg-white text-on-surface rounded-md text-sm font-bold shadow-sm">최신순</button>
                <button className="px-5 py-1.5 text-on-surface-variant rounded-md text-sm font-bold hover:text-on-surface transition-colors">시급순</button>
              </div>
            </div>

            <div className="space-y-6">
              {urgentJobs.map((job) => (
                <div
                  key={`${job.brand}-${job.title}`}
                  className={`${job.urgent ? 'bg-primary-soft' : 'bg-white'} border-[0.5px] border-outline shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-6 rounded-2xl relative group hover:shadow-lg transition-all`}
                >
                  {job.urgent && (
                    <div className="absolute top-8 right-8">
                      <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>{job.icon}</span>
                    </div>
                  )}

                  <div className="flex gap-6">
                    <div className={`w-16 h-16 ${job.urgent ? 'bg-white' : 'bg-[#f9f9f9]'} rounded-xl flex-shrink-0 overflow-hidden border-[0.5px] border-outline p-2`}>
                      <img alt="Brand Icon" className="w-full h-full object-contain" src={job.logo} />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${job.urgent ? 'text-primary' : 'text-on-surface-variant'}`}>{job.brand}</span>
                        {job.urgent && (
                          <div className="bg-primary text-white px-2 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span>
                            긴급
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg md:text-xl leading-tight font-bold tracking-tight group-hover:text-primary transition-colors">{job.title}</h3>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-on-surface-variant">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-lg">location_on</span>
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-on-surface">
                          <span className="material-symbols-outlined text-lg text-primary">payments</span>
                          {job.payLabel} <span className={`font-black ml-1 ${job.urgent ? 'text-primary' : ''}`}>{job.pay}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-lg">schedule</span>
                          {job.schedule}
                        </div>
                      </div>

                      <div className="pt-1 text-[10px] font-medium text-on-surface-variant/60">{job.posted}</div>
                    </div>

                    {!job.urgent && (
                      <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors self-start">bookmark</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex justify-center items-center gap-3">
              <CommonButton variant="pagination" size="squareLg">
                <span className="material-symbols-outlined">chevron_left</span>
              </CommonButton>
              <CommonButton variant="pagination" size="squareLg" active>1</CommonButton>
              <CommonButton variant="pagination" size="squareLg">2</CommonButton>
              <CommonButton variant="pagination" size="squareLg">3</CommonButton>
              <CommonButton variant="pagination" size="squareLg">4</CommonButton>
              <CommonButton variant="pagination" size="squareLg">
                <span className="material-symbols-outlined">chevron_right</span>
              </CommonButton>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />

      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-white/95 backdrop-blur-lg border-t-[0.5px] border-outline flex justify-around items-center px-6 pb-safe z-50">
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold mt-1">홈</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>list_alt</span>
          <span className="text-[10px] font-bold mt-1">공고</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">distance</span>
          <span className="text-[10px] font-bold mt-1">주변</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="text-[10px] font-bold mt-1">채팅</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold mt-1">내정보</span>
        </a>
      </nav>

    </>
  );
}
