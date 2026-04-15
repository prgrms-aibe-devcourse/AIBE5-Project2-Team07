import React from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

export default function RecruitInformationPage() {
  return (
	<>
	  <TopNavBar />
	  <main className="custom-container pt-32 pb-20">
		{/* 검색 및 필터 영역 */}
		<section className="mb-12">
		  <div className="flex flex-col gap-6 bg-[#f9f9f9] p-10 rounded-2xl">
			<div className="relative w-full max-w-4xl">
			  <input
				className="w-full h-14 pl-6 pr-12 text-lg bg-white border-none rounded-lg focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/50 font-medium"
				placeholder="어떤 일자리를 찾으시나요? 키워드를 입력해 보세요."
				type="text"
			  />
			  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary text-3xl">search</span>
			</div>
			<div className="flex flex-wrap items-center justify-between gap-4">
			  <div className="flex flex-wrap items-center gap-2">
				<CommonButton
				  variant="toggle"
				  size="sm"
				  active
				  activeClassName="bg-white border-[#e0e0e0] text-primary"
				  icon={<span className="material-symbols-outlined text-sm">emergency</span>}
				>
				  긴급
				</CommonButton>
				<CommonButton variant="toggle" size="sm" inactiveClassName="bg-white border border-[#e0e0e0] hover:border-primary font-medium text-on-surface">지역별</CommonButton>
				<CommonButton variant="toggle" size="sm" inactiveClassName="bg-white border border-[#e0e0e0] hover:border-primary font-medium text-on-surface">기간별</CommonButton>
				<CommonButton variant="toggle" size="sm" inactiveClassName="bg-white border border-[#e0e0e0] hover:border-primary font-medium text-on-surface">업종별</CommonButton>
				<CommonButton className="ml-2 p-2 text-on-surface-variant hover:text-primary shadow-none" variant="toggle" title="초기화">
				  <span className="material-symbols-outlined">restart_alt</span>
				</CommonButton>
			  </div>
			  <CommonButton
				variant="dark"
				href="#"
				size="md"
				icon={<span className="material-symbols-outlined text-sm">arrow_forward_ios</span>}
				className="shadow-sm"
				activeClassName=""
				inactiveClassName=""
			  >
				<span className="material-symbols-outlined">smart_toy</span>
				AI 추천 공고 바로가기
			  </CommonButton>
			</div>
		  </div>
		</section>

		{/* 긴급 및 AI 추천 공고 */}
		<section className="mb-16">
		  <div className="flex items-end justify-between mb-6 border-b-[3px] border-primary pb-3">
			<h2 className="text-2xl font-extrabold tracking-tighter flex items-center gap-2">
			  <span className="text-primary material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span>
			  긴급 및 AI 추천 공고
			</h2>
			<span className="text-sm text-on-surface-variant mb-1 font-medium">실시간으로 매칭된 가장 급한 공고입니다.</span>
		  </div>
		  <div className="grid grid-cols-1 md:grid-cols-[48%_52%] gap-6">
			{/* 긴급공고 카드 */}
			<div className="urgent-accent bg-white p-8 border border-outline rounded-xl flex flex-col justify-between hover:bg-primary-soft/30 transition-all cursor-pointer group shadow-sm relative overflow-hidden">
			  <div className="flex justify-between items-start mb-4">
				<div className="flex flex-col gap-1">
				  <span className="text-xs font-bold text-primary flex items-center gap-1">
					<span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span> 긴급공고
				  </span>
				  <h3 className="text-xl font-bold text-on-surface leading-tight">(주)글로벌 푸드 서비스</h3>
				  <p className="text-on-surface font-semibold">[마감임박] 행사 보조 스태프 급구 (식사제공)</p>
				</div>
				<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
				  <button className="p-2 bg-[#f9f9f9] rounded-md hover:text-primary"><span className="material-symbols-outlined text-xl">bookmark</span></button>
				  <button className="p-2 bg-[#f9f9f9] rounded-md hover:text-primary"><span className="material-symbols-outlined text-xl">share</span></button>
				</div>
			  </div>
			  <div className="flex flex-wrap items-center justify-between mt-4">
				<div className="flex items-center gap-x-4 text-sm text-on-surface-variant">
				  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">location_on</span> 서울 강남구</span>
				  <span className="flex items-center gap-1 font-bold text-primary"><span className="material-symbols-outlined text-base">payments</span> 시급 15,000원</span>
				</div>
				<span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold">D-0</span>
			  </div>
			  <Link to="/recruit-detail" className="absolute inset-0 z-10"></Link>
			</div>
			{/* AI 추천 카드 */}
			<div className="urgent-accent bg-white p-8 border border-outline rounded-xl flex flex-col justify-between hover:bg-primary-soft/30 transition-all cursor-pointer group shadow-sm relative overflow-hidden">
			  <div className="flex justify-between items-start mb-4">
				<div className="flex flex-col gap-1">
				  <span className="text-xs font-bold text-primary flex items-center gap-1">
					<span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>smart_toy</span> AI 추천
				  </span>
				  <h3 className="text-xl font-bold text-on-surface leading-tight">카페 아우라 판교점</h3>
				  <p className="text-on-surface font-semibold">오후 타임 파트타이머 채용 (경력우대)</p>
				</div>
				<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
				  <button className="p-2 bg-[#f9f9f9] rounded-md hover:text-primary"><span className="material-symbols-outlined text-xl">bookmark</span></button>
				  <button className="p-2 bg-[#f9f9f9] rounded-md hover:text-primary"><span className="material-symbols-outlined text-xl">share</span></button>
				</div>
			  </div>
			  <div className="flex flex-wrap items-center justify-between mt-4">
				<div className="flex items-center gap-x-4 text-sm text-on-surface-variant">
				  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">location_on</span> 경기 성남시 분당구</span>
				  <span className="flex items-center gap-1 font-bold text-primary"><span className="material-symbols-outlined text-base">payments</span> 일급 95,000원</span>
				</div>
				<span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold">D-0</span>
			  </div>
			  <Link to="/recruit-detail" className="absolute inset-0 z-10"></Link>
			</div>
		  </div>
		</section>

		{/* 탭 네비게이션 */}
		<nav className="mb-8 border-b border-outline">
		  <div className="flex gap-8">
			<button className="pb-4 text-lg font-bold text-primary border-b-2 border-primary relative -bottom-[1px]">전체</button>
			<button className="pb-4 text-lg font-medium text-on-surface-variant hover:text-primary transition-colors">단기</button>
			<button className="pb-4 text-lg font-medium text-on-surface-variant hover:text-primary transition-colors">중장기</button>
		  </div>
		</nav>

		{/* 전체 공고 리스트 */}
		<section>
		  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
			<h2 className="text-3xl font-extrabold tracking-tighter">전체 공고 리스트</h2>
			<div className="flex items-center gap-4 text-sm font-medium">
			  <button className="text-on-surface hover:text-primary font-bold">등록순</button>
			  <div className="w-[1px] h-3 bg-outline"></div>
			  <button className="text-on-surface-variant hover:text-primary">급여순</button>
			  <div className="w-[1px] h-3 bg-outline"></div>
			  <button className="text-on-surface-variant hover:text-primary">마감순</button>
			</div>
		  </div>
		  <div className="flex flex-col bg-white border border-outline rounded-xl overflow-hidden shadow-sm">
			{/* 헤더 */}
			<div className="hidden md:grid grid-cols-[1fr_120px_160px_120px_100px_100px] gap-4 px-8 py-5 bg-[#f9f9f9] border-b border-outline text-xs font-bold text-on-surface-variant uppercase tracking-wider">
			  <div className="pl-[4.5rem]">기업 및 공고정보</div>
			  <div>근무지</div>
			  <div>급여정보</div>
			  <div>근무기간</div>
			  <div>시간</div>
			  <div className="text-right">등록일</div>
			</div>
			{/* 리스트 아이템 샘플 1 (긴급) */}
			<div className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px_120px_100px_100px] gap-4 px-8 py-6 items-center hover:bg-[#f9f9f9] border-b border-outline cursor-pointer transition-colors relative">
			  <div className="flex items-center gap-4">
				<span className="text-primary material-symbols-outlined text-xl w-6 shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span>
				<img alt="logo" className="w-10 h-10 rounded-lg bg-gray-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-AksnIzqBWi7qSBwIrl_BiYi5JKH-9FqfewhwspUWopYBXw2xeMueMZwp9LVroGZMOef4jMLbuGWst4J3vZlAmI26eETS0TCEd_CAWnoir61V5WBpuZLl_dG5LZANsqL7qzP_91reAIbApDt2MN1DOktlPJ3qP6qqFUNotah6DctaG2sN0ZOU7Dng8eAJRredrxJ_qkPCwKdI97vVZFFG1BAExHV2o0SU93C-sSKzP0sdv_2uX6Cbm1e053nxmiBbqJ9T5MroI0E" />
				<div className="flex flex-col gap-0.5">
				  <span className="text-xs font-bold text-on-surface-variant">베이커리 라망</span>
				  <h4 className="text-[15px] font-bold text-primary">당일 마감 임박 스텝 급구</h4>
				</div>
			  </div>
			  <div className="text-sm">서울 영등포구</div>
			  <div className="text-sm font-bold text-primary">시급 12,000원</div>
			  <div className="text-sm">단기 (1일)</div>
			  <div className="text-sm">09:00~18:00</div>
			  <div className="text-xs text-on-surface-variant text-right">오늘</div>
			  <Link to="/recruit-detail" className="absolute inset-0 z-10"></Link>
			</div>
			{/* 리스트 아이템 샘플 2 (일반) */}
			<div className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px_120px_100px_100px] gap-4 px-8 py-6 items-center hover:bg-[#f9f9f9] border-b border-outline cursor-pointer transition-colors">
			  <div className="flex items-center gap-4">
				<div className="w-6 shrink-0"></div>
				<img alt="logo" className="w-10 h-10 rounded-lg bg-gray-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs8ow1thUIMA9QnUaRMsTiitKsBAf5Yiyp-7IeLbRDzt_o7RdGQOTtVwcTCuvnlKex-ZmtGYnpTsxA-Dl4J3GT7NwUJo5FZawSyd9sM8mNo9BGjKFFdywXPJAIFZT8Wx2ZhsJJ0ETiAePcAvjJRKeQSrSrzhKliqkJR715yAHsT6kk06KmQJ-klnSQeKKeXKAgQaEmwrT8rY9EKFCbS8CIKqNI1GbucWSOPuIQKUK4-kmOmFNHd3yQKQZdNNF4DVUC1bWUe5rKe80" />
				<div className="flex flex-col gap-0.5">
				  <span className="text-xs font-bold text-on-surface-variant">삼성물산 리조트부문</span>
				  <h4 className="text-[15px] font-medium text-on-surface">에버랜드 주말 캐스트 상시 채용</h4>
				</div>
			  </div>
			  <div className="text-sm">경기 용인시</div>
			  <div className="text-sm font-medium">월급 2,400,000원</div>
			  <div className="text-sm">3개월~6개월</div>
			  <div className="text-sm">스케줄 근무</div>
			  <div className="text-xs text-on-surface-variant text-right">방금전</div>
			  <Link to="/recruit-detail" className="absolute inset-0 z-10"></Link>
			</div>
			{/* 리스트 아이템 샘플 3 (긴급) */}
			<div className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px_120px_100px_100px] gap-4 px-8 py-6 items-center hover:bg-[#f9f9f9] border-b border-outline cursor-pointer transition-colors relative">
			  <div className="flex items-center gap-4">
				<span className="text-primary material-symbols-outlined text-xl w-6 shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span>
				<img alt="logo" className="w-10 h-10 rounded-lg bg-gray-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrNlgo5OuEkzQZcqqUx8cXq5pmsgzip14S1_q5QvqHZw3DRjIsxFJYtcUuM6bnVhGpCQTPliCyRdcCU46AAoVemu3F1l8cjWJQcnmeZ_Aa0L6VFC4ATC3PgWzQKG3pSU3fDFoSlKesYCAAJoHyz128zdVEt4XnstsnwXj0D454_GZIqvU-HPlRuc2SUHE3ufInUIqSNuqj4Kc5NF1elvHfpamYajKotp4FrGmzjNRX_3yJSVFrJ8B98odCbYiwp9LNComKwISRPu8" />
				<div className="flex flex-col gap-0.5">
				  <span className="text-xs font-bold text-on-surface-variant">코엑스 전시사업팀</span>
				  <h4 className="text-[15px] font-bold text-primary">박람회 운영 지원 보조원 긴급 모집</h4>
				</div>
			  </div>
			  <div className="text-sm">서울 강남구</div>
			  <div className="text-sm font-bold text-primary">일급 110,000원</div>
			  <div className="text-sm">단기 (1일)</div>
			  <div className="text-sm">08:00~17:00</div>
			  <div className="text-xs text-on-surface-variant text-right">1시간전</div>
			  <Link to="/recruit-detail" className="absolute inset-0 z-10"></Link>
			</div>
			{/* 리스트 아이템 샘플 4 (일반) */}
			<div className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px_120px_100px_100px] gap-4 px-8 py-6 items-center hover:bg-[#f9f9f9] border-b border-outline cursor-pointer transition-colors">
			  <div className="flex items-center gap-4">
				<div className="w-6 shrink-0"></div>
				<img alt="logo" className="w-10 h-10 rounded-lg bg-gray-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4goXB1fl0ru0Dx3Rc0LjSjbLSs-iGPzzviKdKEM_5ZHMWD42_aS-icZiPEpR18nYoeTmp_Ud80YC_u_h3Gp5u3ptY0HNBO0YkC2oYEoEk9oxMPJceu9akMzOjC_gcZ9zpFap-vzQzXzI3_433AGD-2DHnrzSAdx2Ax_I51HVJcVUeBrRmk-7X49rm8WkFtH5hobzsKOd5d3sgcyltpnbPqucpxbwSTwXZ8POgnK6u5ixuJCrTjEyeWa93LsJTelhhzcP9dxy6Y-0" />
				<div className="flex flex-col gap-0.5">
				  <span className="text-xs font-bold text-on-surface-variant">스타벅스 코리아</span>
				  <h4 className="text-[15px] font-medium text-on-surface">바리스타 신입 및 경력 채용 (강남권)</h4>
				</div>
			  </div>
			  <div className="text-sm">서울 서초구</div>
			  <div className="text-sm font-medium">시급 11,200원</div>
			  <div className="text-sm">6개월 이상</div>
			  <div className="text-sm">07:00~15:00</div>
			  <div className="text-xs text-on-surface-variant text-right">2시간전</div>
			  <Link to="/recruit-detail" className="absolute inset-0 z-10"></Link>
			</div>
			{/* 리스트 아이템 샘플 5 (일반) */}
			<div className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px_120px_100px_100px] gap-4 px-8 py-6 items-center hover:bg-[#f9f9f9] border-b border-outline cursor-pointer transition-colors">
			  <div className="flex items-center gap-4">
				<div className="w-6 shrink-0"></div>
				<img alt="logo" className="w-10 h-10 rounded-lg bg-gray-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtkpqVj4CWPIhpo4QgiAufRHd4h09Tvf8vLZdwzoA8_N8efsTJLKEMQkIGHgCksxtJjFI09uxz7BbzHt0ZKh5pkeVFqawsAWJvZr85ArkNM-zmYPotKWzUsfYHXw6W2nKYkXn8nJeNX7w7Mq8AFWVKS4okhTD_Q180iurkb4WWBLXC5vNae228SSOVrkNWqJxvb0j-Io1yMyNqbSiQDvXQW1gdtWR_Funv9tyXClM4OLBlOEOVBnctAAegTr6ncmx85Nn-KFS18Po" />
				<div className="flex flex-col gap-0.5">
				  <span className="text-xs font-bold text-on-surface-variant">쿠팡 풀필먼트 서비스</span>
				  <h4 className="text-[15px] font-medium text-on-surface">물류센터 입출고 및 검수 단기 사원</h4>
				</div>
			  </div>
			  <div className="text-sm">경기 안성시</div>
			  <div className="text-sm font-medium">일급 98,000원</div>
			  <div className="text-sm">단기/장기</div>
			  <div className="text-sm">19:00~04:00</div>
			  <div className="text-xs text-on-surface-variant text-right">3시간전</div>
			  <Link to="/recruit-detail" className="absolute inset-0 z-10"></Link>
			</div>
			{/* 리스트 아이템 샘플 6 (긴급) */}
			<div className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px_120px_100px_100px] gap-4 px-8 py-6 items-center hover:bg-[#f9f9f9] border-b border-outline cursor-pointer transition-colors relative">
			  <div className="flex items-center gap-4">
				<span className="text-primary material-symbols-outlined text-xl w-6 shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span>
				<img alt="logo" className="w-10 h-10 rounded-lg bg-gray-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS72aWzmcThAS8SWteSouyHs2onfJzlG2zlJc-M3gHM_ptuxgVZB7F45APyEcys5K5QwJuXqYKWDaaHvkb6Od9_yHphW6wk95hc_tJDq1yxBPJgPR49_IYO2iWH7svsTilSX-gk0in-bvpaCe7JCZU480_Kx_kqqtLNce2wP76cjycBygVkTp7dPMn91nz18vT2-DXzq-6rdSXon4Am4gz2yAAEoB4F5Hd_Y_QniNEvsOZowNcjWU0eavi0Cupc5FYw6JzjfoOjm8" />
				<div className="flex flex-col gap-0.5">
				  <span className="text-xs font-bold text-on-surface-variant">CJ대한통운</span>
				  <h4 className="text-[15px] font-bold text-primary">분류 작업 보조 긴급 구인 (석식제공)</h4>
				</div>
			  </div>
			  <div className="text-sm">서울 송파구</div>
			  <div className="text-sm font-bold text-primary">시급 13,500원</div>
			  <div className="text-sm">단기 (3일)</div>
			  <div className="text-sm">18:00~23:00</div>
			  <div className="text-xs text-on-surface-variant text-right">4시간전</div>
			  <Link to="/recruit-detail" className="absolute inset-0 z-10"></Link>
			</div>
			{/* 리스트 아이템 샘플 7 (일반) */}
			<div className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px_120px_100px_100px] gap-4 px-8 py-6 items-center hover:bg-[#f9f9f9] border-b border-outline cursor-pointer transition-colors">
			  <div className="flex items-center gap-4">
				<div className="w-6 shrink-0"></div>
				<img alt="logo" className="w-10 h-10 rounded-lg bg-gray-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAExa0uMwvGlE5G0avJZoWTXAikyUTGe-BeNRUdRIqkCBkBZrnhLLV5AcZ6uew4L6BX_BCLByrpXSXkCTSJjFr9kutfXVufT_nvBKOZbWtwwirTIMGDYu1gYEKcWGiaTIFTwN4JoiPZlmdXNJ3pbSyJSmPdM8NuQ_lHBuW4m-KvztJMTv3m-7u1gli_s4oOb5pBsVm8vBhshL2nPTTuP4l9A8_itD8hRkDiquRvpGIQuYSJayyPMnUvbsi61OKs7q6aB_lH7gTCB4k" />
				<div className="flex flex-col gap-0.5">
				  <span className="text-xs font-bold text-on-surface-variant">올리브영 명동본점</span>
				  <h4 className="text-[15px] font-medium text-on-surface">매장 관리 및 고객 응대 스태프 모집</h4>
				</div>
			  </div>
			  <div className="text-sm">서울 중구</div>
			  <div className="text-sm font-medium">시급 10,500원</div>
			  <div className="text-sm">1년 이상</div>
			  <div className="text-sm">14:00~22:30</div>
			  <div className="text-xs text-on-surface-variant text-right">5시간전</div>
			  <Link to="/recruit-detail" className="absolute inset-0 z-10"></Link>
			</div>
			{/* 리스트 아이템 샘플 8 (일반) */}
			<div className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px_120px_100px_100px] gap-4 px-8 py-6 items-center hover:bg-[#f9f9f9] border-b border-outline cursor-pointer transition-colors">
			  <div className="flex items-center gap-4">
				<div className="w-6 shrink-0"></div>
				<img alt="logo" className="w-10 h-10 rounded-lg bg-gray-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA11DuTLS-FExffTyHGKwVMCGXYM8CF2K9Zz6E1ZxddGRJRnG58LZUElYp4qzFJMO5L6otIp35GDIH6mdRjF75KhXcTwsK8__Ta0MBfgiTy3_HEnu9TRT_-IWA0uF0tvLDQQR0-2uA8FOmBcwwRT3pHE2SgK_Co63DSBw3vvhmtYj1h9XkxuaFOuhpoNEsi7hBJrG0DVMmRz6n2BD9uNmR88D17ISMYx2d6n9p4hpZyCk2k2K-xAStrLaYhzVMaHYdWj6lq-1Sh5wU" />
				<div className="flex flex-col gap-0.5">
				  <span className="text-xs font-bold text-on-surface-variant">파리바게뜨 광화문점</span>
				  <h4 className="text-[15px] font-medium text-on-surface">오전 베이커리 판매 및 포장 업무</h4>
				</div>
			  </div>
			  <div className="text-sm">서울 종로구</div>
			  <div className="text-sm font-medium">시급 10,000원</div>
			  <div className="text-sm">6개월~1년</div>
			  <div className="text-sm">07:00~13:00</div>
			  <div className="text-xs text-on-surface-variant text-right">6시간전</div>
			  <Link to="/recruit-detail" className="absolute inset-0 z-10"></Link>
			</div>
			{/* 리스트 아이템 샘플 9 (긴급) */}
			<div className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px_120px_100px_100px] gap-4 px-8 py-6 items-center hover:bg-[#f9f9f9] cursor-pointer transition-colors relative">
			  <div className="flex items-center gap-4">
				<span className="text-primary material-symbols-outlined text-xl w-6 shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>emergency</span>
				<img alt="logo" className="w-10 h-10 rounded-lg bg-gray-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2XG8mp7vGlBOnFMNFwxmnLng9udw8LdTms7x1YY0S1PQhQPo0DboQ6FCze4TUTaFTJjE6Dihr-87KavLxGeoa8bHHw_44mSMuSuntMNTicmyFdh-UXXiX03Fyo6zxR5v7i4NWxuCn5XNMNxi0-rXuLN1vEg8T8xvKLH_Jy2PQf0Bp1PFJoX9WWXxpNUBZllG34I4GZkHrvBhwwMCsMyqeGn1TJoZKLuYlCoL3IHPPEqIthkgBTnIrPtDtd3fmh-WZ3zJIte5l80s" />
				<div className="flex flex-col gap-0.5">
				  <span className="text-xs font-bold text-on-surface-variant">배달의민족 비마트</span>
				  <h4 className="text-[15px] font-bold text-primary">피킹/패킹 파트타이머 급구 (주말)</h4>
				</div>
			  </div>
			  <div className="text-sm">서울 마포구</div>
			  <div className="text-sm font-bold text-primary">시급 11,500원</div>
			  <div className="text-sm">3개월 이상</div>
			  <div className="text-sm">스케줄 근무</div>
			  <div className="text-xs text-on-surface-variant text-right">7시간전</div>
			  <Link to="/recruit-detail" className="absolute inset-0 z-10"></Link>
			</div>
		  </div>
		  {/* 페이징 */}
		  <div className="flex justify-center items-center gap-2 mt-12">
			<CommonButton variant="pagination" size="square">
			  <span className="material-symbols-outlined">chevron_left</span>
			</CommonButton>
			<CommonButton variant="pagination" size="square" active>1</CommonButton>
			<CommonButton variant="pagination" size="square">2</CommonButton>
			<CommonButton variant="pagination" size="square">3</CommonButton>
			<CommonButton variant="pagination" size="square">4</CommonButton>
			<CommonButton variant="pagination" size="square">5</CommonButton>
			<CommonButton variant="pagination" size="square">
			  <span className="material-symbols-outlined">chevron_right</span>
			</CommonButton>
		  </div>
		</section>
	  </main>
	  <AppFooter />
	  <MobileBottomNav />
	</>
  );
}

