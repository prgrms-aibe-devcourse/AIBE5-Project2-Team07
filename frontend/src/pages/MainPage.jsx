import React, { useState, useRef, useEffect } from "react";
import TopNavBar from "../components/TopNavBar";
import MobileBottomNav from "../components/MobileBottomNav";
import { Link } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import CommonButton from "../components/CommonButton";
import NearbyJobsSection from "../components/NearbyJobsSection";
import { useNearbyJobs } from "../hooks/useNearbyJobs";

export default function MainPage() {
  const [selectedDistance, setSelectedDistance] = useState("5km");
  const [isDistanceDropdownOpen, setIsDistanceDropdownOpen] = useState(false);
  const [isNearbyMode, setIsNearbyMode] = useState(false);
  const dropdownRef = useRef(null);

  const { jobs: nearbyJobs, loading: nearbyLoading, error: nearbyError, fetchJobs } = useNearbyJobs();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDistanceDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /** 거리 옵션 선택 → 주변 공고 모드 활성화 + API 호출 */
  function handleDistanceSelect(distance) {
    const radiusKm = parseFloat(distance.replace('km', ''));
    setSelectedDistance(distance);
    setIsDistanceDropdownOpen(false);
    setIsNearbyMode(true);
    fetchJobs(radiusKm);
  }

  return (
    <>
      <TopNavBar />
      <main className="pt-20">
        {/* Hero Banner Section */}
        <section className="pt-8 pb-12 bg-white">
          <div className="custom-container">
            <div className="hero-gradient rounded-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between p-10 md:p-12 relative min-h-[320px]">
              <div className="z-10 text-center md:text-left space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-1.5 rounded-full text-primary font-bold text-xs border border-primary/30 backdrop-blur-sm">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    notifications_active
                  </span>
                  긴급 매칭
                </div>
                <h1 className="text-white text-3xl md:text-4xl font-extrabold leading-[1.2] tracking-tight">
                  알바 펑크 났어? 대타 불러!
                </h1>
                <p className="text-white/60 text-base font-medium">
                  평균 매칭 시간 15분. 지각 없는 검증된 인재를 바로
                  연결해드립니다.
                </p>
                <CommonButton className="mt-2" size="lg">
                  전체 급구 공고 보기
                </CommonButton>
              </div>
              <div className="hidden md:block absolute right-0 top-0 bottom-0 w-3/5">
                <img
                  alt="Professional workspace"
                  className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTW1fdO6U3QwEHuPCuBshMpupR90GUtEDzRMsbW-yPRBz6VWTwmHT1cJZFSA4N8aQP02aoTIjMyE7ZGHFs3FZWBha6gF1mpkQ5fD4txI0eL7kDKjBvcM7U5l9rQqCw3MaiGf40d9_esIvI7YIoMbWmmZQykSB7bvLg8N36PCgxAfvjSYFmUj4Imz7Y8q6kCsQXAvT5dCrgZo41c-0U2LC4WOch0mGDZJpdp-c_0d4lR4pFpCij9EfP0liTpG_ccQwrxr0nz-zQ8DI"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1818] via-[#1A1818]/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Urgent Job Ads Section */}
        <section className="bg-white py-10">
          <div className="custom-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter">
                  급구 공고
                </h2>
                <p className="text-on-surface-variant font-medium mt-2">
                  지금 바로 지원 가능한 긴급 구인 건입니다.
                </p>
              </div>
              <Link
                to="/ai-recommend"
                className="text-primary font-bold flex items-center gap-1 group py-2"
              >
                더보기{" "}
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-primary-soft rounded-xl p-7 flex flex-col justify-between min-h-[240px] transition-all shadow-md shadow-primary/5 hover:shadow-xl hover:-translate-y-1 relative">
                <div>
                  <span className="text-primary font-bold text-xs block mb-1">
                    삼성동 마이카페
                  </span>
                  <h3 className="text-lg font-bold leading-snug mb-3 flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-primary text-lg"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      notifications_active
                    </span>
                    홀 서빙 및 결제 관리 (즉시 투입)
                  </h3>
                  <div className="flex gap-2 text-on-surface-variant text-[11px] font-semibold">
                    <span>서울 강남구</span>
                    <span>•</span>
                    <span>지금 시작</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-xl font-black text-primary">
                    16,000원
                    <small className="text-[10px] font-bold text-on-surface ml-1">
                      /시간
                    </small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors">
                    bookmark
                  </button>
                </div>
                <Link
                  to="/recruit-detail"
                  className="absolute inset-0 z-10"
                ></Link>
              </div>

              {/* Card 2 */}
              <div className="bg-primary-soft rounded-xl p-7 flex flex-col justify-between min-h-[240px] transition-all shadow-md shadow-primary/5 hover:shadow-xl hover:-translate-y-1 relative">
                <div>
                  <span className="text-primary font-bold text-xs block mb-1">
                    판교 정보단지
                  </span>
                  <h3 className="text-lg font-bold leading-snug mb-3 flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-primary text-lg"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      notifications_active
                    </span>
                    행사 등록 데스크 안내 요원
                  </h3>
                  <div className="flex gap-2 text-on-surface-variant text-[11px] font-semibold">
                    <span>경기 성남시</span>
                    <span>•</span>
                    <span>14:00 시작</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-xl font-black text-primary">
                    13,500원
                    <small className="text-[10px] font-bold text-on-surface ml-1">
                      /시간
                    </small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors">
                    bookmark
                  </button>
                </div>
                <Link
                  to="/recruit-detail"
                  className="absolute inset-0 z-10"
                ></Link>
              </div>

              {/* Card 3 */}
              <div className="bg-primary-soft rounded-xl p-7 flex flex-col justify-between min-h-[240px] transition-all shadow-md shadow-primary/5 hover:shadow-xl hover:-translate-y-1 relative">
                <div>
                  <span className="text-primary font-bold text-xs block mb-1">
                    더 플랜지
                  </span>
                  <h3 className="text-lg font-bold leading-snug mb-3 flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-primary text-lg"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      notifications_active
                    </span>
                    주방 설거지 및 뒷정리 보조
                  </h3>
                  <div className="flex gap-2 text-on-surface-variant text-[11px] font-semibold">
                    <span>서울 종로구</span>
                    <span>•</span>
                    <span>18:00 시작</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-xl font-black text-primary">
                    15,000원
                    <small className="text-[10px] font-bold text-on-surface ml-1">
                      /시간
                    </small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors">
                    bookmark
                  </button>
                </div>
                <Link
                  to="/recruit-detail"
                  className="absolute inset-0 z-10"
                ></Link>
              </div>

              {/* Card 4 */}
              <div className="bg-primary-soft rounded-xl p-7 flex flex-col justify-between min-h-[240px] transition-all shadow-md shadow-primary/5 hover:shadow-xl hover:-translate-y-1 relative">
                <div>
                  <span className="text-primary font-bold text-xs block mb-1">
                    메디 스캔
                  </span>
                  <h3 className="text-lg font-bold leading-snug mb-3 flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-primary text-lg"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      notifications_active
                    </span>
                    검진 센터 문서 파쇄 단기 알바
                  </h3>
                  <div className="flex gap-2 text-on-surface-variant text-[11px] font-semibold">
                    <span>서울 서초구</span>
                    <span>•</span>
                    <span>즉시 가능</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-xl font-black text-primary">
                    12,000원
                    <small className="text-[10px] font-bold text-on-surface ml-1">
                      /시간
                    </small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors">
                    bookmark
                  </button>
                </div>
                <Link
                  to="/recruit-detail"
                  className="absolute inset-0 z-10"
                ></Link>
              </div>
            </div>
          </div>
        </section>

        {/* AI Recommendation Section */}
        <section className="bg-[#f9f9f9] py-10">
          <div className="custom-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tighter">
                  AI 추천 공고
                </h2>
                <p className="text-on-surface-variant font-medium mt-2">
                  내 경력과 위치를 기반으로 한 맞춤형 일자리
                </p>
              </div>
              <button className="text-primary font-bold flex items-center gap-1 group py-2">
                더보기{" "}
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Urgent Card */}
              <div className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-[260px] relative transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-bold text-sm block">
                      프리미엄 라운지
                    </span>
                    <div className="bg-primary text-white px-2 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[12px]"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        emergency
                      </span>
                      긴급
                    </div>
                  </div>
                  <h3 className="text-xl font-bold leading-tight mb-2">
                    청담동 하이엔드 카페 주말 오후 서빙 스태프
                  </h3>
                  <div className="flex gap-2 text-on-surface-variant text-xs font-semibold">
                    <span>서울 강남구</span>
                    <span>•</span>
                    <span>오늘 14:00 시작</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-6">
                  <span className="text-2xl font-black text-primary">
                    15,000원
                    <small className="text-xs font-bold text-on-surface ml-1">
                      /시간
                    </small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors">
                    bookmark
                  </button>
                </div>
              </div>

              {/* Standard Card 1 */}
              <div className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-[260px] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col gap-2">
                  <span className="text-on-surface-variant font-bold text-sm block mb-2">
                    에이치 리테일
                  </span>
                  <h3 className="text-xl font-bold leading-tight mb-2">
                    강남역 인근 대형 매장 상품 진열 및 재고 관리
                  </h3>
                  <div className="flex gap-2 text-on-surface-variant text-xs font-semibold">
                    <span>서울 서초구</span>
                    <span>•</span>
                    <span>내일부터 시작</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-6">
                  <span className="text-2xl font-black text-on-surface">
                    11,500원
                    <small className="text-xs font-bold text-on-surface-variant ml-1">
                      /시간
                    </small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors">
                    bookmark
                  </button>
                </div>
              </div>

              {/* Standard Card 2 */}
              <div className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-[260px] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col gap-2">
                  <span className="text-on-surface-variant font-bold text-sm block mb-2">
                    베이커리 온
                  </span>
                  <h3 className="text-xl font-bold leading-tight mb-2">
                    가로수길 베이커리 카페 마감 청소 및 포장 파트
                  </h3>
                  <div className="flex gap-2 text-on-surface-variant text-xs font-semibold">
                    <span>서울 강남구</span>
                    <span>•</span>
                    <span>월-금 고정</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-6">
                  <span className="text-2xl font-black text-on-surface">
                    10,500원
                    <small className="text-xs font-bold text-on-surface-variant ml-1">
                      /시간
                    </small>
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors">
                    bookmark
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Total Jobs Section */}
        <section className="bg-white py-10">
          <div className="custom-container">
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-extrabold tracking-tighter">
                  전체 공고
                </h2>
                <div className="flex gap-2 bg-outline/20 p-1 rounded-lg">
                  <button className="px-4 py-1.5 bg-white text-on-surface rounded-md text-sm font-bold shadow-sm">
                    최신순
                  </button>
                  <button className="px-4 py-1.5 text-on-surface-variant rounded-md text-sm font-bold hover:text-on-surface transition-colors">
                    시급순
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pb-2">
                <button
                  onClick={() => setIsNearbyMode(false)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap shadow-sm transition-colors ${
                    !isNearbyMode
                      ? 'bg-primary text-white'
                      : 'bg-white border border-[#e0e0e0] text-[#555555] hover:bg-gray-50'
                  }`}
                >
                  전체
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setIsDistanceDropdownOpen(!isDistanceDropdownOpen)
                    }
                    className={`flex items-center gap-1 px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                      isNearbyMode
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-white border border-[#e0e0e0] text-[#555555] hover:bg-gray-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">near_me</span>
                    내 주변 {selectedDistance}
                    <span className="material-symbols-outlined text-[16px]">
                      {isDistanceDropdownOpen
                        ? "keyboard_arrow_up"
                        : "keyboard_arrow_down"}
                    </span>
                  </button>
                  {isDistanceDropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-full min-w-[120px] bg-white border border-[#e0e0e0] rounded-xl shadow-lg z-50 overflow-hidden">
                      {["1km", "3km", "5km", "10km"].map((distance) => (
                        <button
                          key={distance}
                          onClick={() => handleDistanceSelect(distance)}
                          className={`w-full text-center px-4 py-3 text-sm font-bold transition-colors ${
                            selectedDistance === distance && isNearbyMode
                              ? "text-primary bg-primary/10"
                              : "text-[#555555] hover:bg-gray-50"
                          }`}
                        >
                          {distance}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="px-6 py-2.5 bg-white border border-[#e0e0e0] text-[#555555] rounded-full text-sm font-bold whitespace-nowrap hover:bg-gray-50 transition-colors">
                  단기 알바
                </button>
                <button className="px-6 py-2.5 bg-white border border-[#e0e0e0] text-[#555555] rounded-full text-sm font-bold whitespace-nowrap hover:bg-gray-50 transition-colors">
                  외국인 가능
                </button>
                <button className="px-6 py-2.5 bg-white border border-[#e0e0e0] text-[#555555] rounded-full text-sm font-bold whitespace-nowrap hover:bg-gray-50 transition-colors">
                  맞춤 필터
                </button>
              </div>
            </div>

            {/* 주변 공고 모드일 때 NearbyJobsSection이 자체 헤더 포함 */}
            {isNearbyMode ? (
              <NearbyJobsSection
                jobs={nearbyJobs}
                loading={nearbyLoading}
                error={nearbyError}
                selectedDistance={selectedDistance}
              />
            ) : (
              <>
                {/* Table Header - 전체 공고 */}
                <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#e8e8e8] text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                  <div className="col-span-5">기업 및 공고명</div>
                  <div className="col-span-2">지역</div>
                  <div className="col-span-2">카테고리</div>
                  <div className="col-span-2 text-right">급여 및 마감</div>
                  <div className="col-span-1 text-right">등록</div>
                </div>

            {/* Job Item 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-6 border-b border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors items-center">
              <div className="col-span-1 lg:col-span-5">
                <p className="text-[11px] font-bold text-primary mb-0.5">
                  대치동 입시학원
                </p>
                <h4 className="text-base font-bold flex items-center gap-1.5">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-primary mr-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      notifications_active
                    </span>
                  </span>
                  보조 강사 급구 (금일 17시)
                </h4>
              </div>
              <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm mr-1 lg:hidden">
                  location_on
                </span>{" "}
                서울 강남구
              </div>
              <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm mr-1 lg:hidden">
                  category
                </span>{" "}
                교육/학원
              </div>
              <div className="col-span-1 lg:col-span-2 text-left lg:text-right">
                <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-0">
                  <span className="text-lg font-black text-primary">
                    18,000원
                  </span>
                  <span className="text-[11px] font-bold text-primary">
                    D-0
                  </span>
                </div>
              </div>
              <div className="col-span-1 lg:col-span-1 flex justify-between lg:justify-end items-center">
                <span className="text-[11px] font-medium text-on-surface-variant">
                  15분 전
                </span>
                <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors lg:hidden">
                  bookmark
                </button>
              </div>
            </div>

            {/* Job Item 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-6 border-b border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors items-center">
              <div className="col-span-1 lg:col-span-5">
                <p className="text-[11px] font-bold mb-0.5">성수 팝업</p>
                <h4 className="text-base font-bold">
                  팝업스토어 안내 데스크 스태프
                </h4>
              </div>
              <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm mr-1 lg:hidden">
                  location_on
                </span>{" "}
                서울 성동구
              </div>
              <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm mr-1 lg:hidden">
                  category
                </span>{" "}
                전시/행사
              </div>
              <div className="col-span-1 lg:col-span-2 text-left lg:text-right">
                <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-0">
                  <span className="text-lg font-black text-on-surface">
                    11,000원
                  </span>
                  <span className="text-[11px] text-stone-400">D-2</span>
                </div>
              </div>
              <div className="col-span-1 lg:col-span-1 flex justify-between lg:justify-end items-center">
                <span className="text-[11px] font-medium text-on-surface-variant">
                  1시간 전
                </span>
                <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors lg:hidden">
                  bookmark
                </button>
              </div>
            </div>

            {/* Job Item 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-6 border-b border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors items-center">
              <div className="col-span-1 lg:col-span-5">
                <p className="text-[11px] font-bold text-primary mb-0.5">
                  압구정 테라스
                </p>
                <h4 className="text-base font-bold flex items-center gap-1.5">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-primary mr-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      notifications_active
                    </span>
                  </span>
                  레스토랑 주방 보조 (내일 고정)
                </h4>
              </div>
              <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm mr-1 lg:hidden">
                  location_on
                </span>{" "}
                서울 강남구
              </div>
              <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm mr-1 lg:hidden">
                  category
                </span>{" "}
                외식/식음료
              </div>
              <div className="col-span-1 lg:col-span-2 text-left lg:text-right">
                <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-0">
                  <span className="text-lg font-black text-primary">
                    14,500원
                  </span>
                  <span className="text-[11px] font-bold text-primary">
                    D-1
                  </span>
                </div>
              </div>
              <div className="col-span-1 lg:col-span-1 flex justify-between lg:justify-end items-center">
                <span className="text-[11px] font-medium text-on-surface-variant">
                  3시간 전
                </span>
                <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors lg:hidden">
                  bookmark
                </button>
              </div>
            </div>

            {/* Job Item 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-6 border-b border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors items-center">
              <div className="col-span-1 lg:col-span-5">
                <p className="text-[11px] font-bold mb-0.5">베베 키즈카페</p>
                <h4 className="text-base font-bold">
                  키즈카페 주말 놀이 보조 선생님
                </h4>
              </div>
              <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm mr-1 lg:hidden">
                  location_on
                </span>{" "}
                서울 서초구
              </div>
              <div className="col-span-1 lg:col-span-2 flex items-center text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm mr-1 lg:hidden">
                  category
                </span>{" "}
                서비스/기타
              </div>
              <div className="col-span-1 lg:col-span-2 text-left lg:text-right">
                <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-0">
                  <span className="text-lg font-black text-on-surface">
                    12,000원
                  </span>
                  <span className="text-[11px] text-stone-400">D-3</span>
                </div>
              </div>
              <div className="col-span-1 lg:col-span-1 flex justify-between lg:justify-end items-center">
                <span className="text-[11px] font-medium text-on-surface-variant">
                  4시간 전
                </span>
                <button className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary transition-colors lg:hidden">
                  bookmark
                </button>
              </div>
            </div>

              <div className="mt-16 flex justify-center">
                <CommonButton
                  to="/recruit-information"
                  variant="outline"
                  size="xl"
                  icon={
                    <span className="material-symbols-outlined text-lg">add</span>
                  }
                >
                  더 많은 공고 보기
                </CommonButton>
              </div>
            </>
            )}
          </div>
        </section>
      </main>
      <AppFooter />
      <MobileBottomNav />
    </>
  );
}
