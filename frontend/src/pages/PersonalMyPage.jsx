import React, { useState } from 'react';
import TopNavBarLoggedIn from '../components/TopNavBarLoggedIn';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

/* ─────────────────────────────────────────────
   각 탭별 콘텐츠 컴포넌트
───────────────────────────────────────────── */

/** 대시보드 탭 (reference _3) */
function DashboardContent() {
  return (
    <section className="flex-grow space-y-8">
      {/* Hero Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 긴급 매칭 현황 */}
        <div className="md:col-span-2 bg-[#FFF0F3] p-10 rounded-2xl flex flex-col justify-between border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span
              className="material-symbols-outlined text-[120px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              notifications_active
            </span>
          </div>
          <div className="z-10">
            <h3 className="text-sm text-primary font-bold uppercase tracking-wider mb-3">긴급 매칭 현황</h3>
            <p className="text-3xl font-extrabold text-[#1F1D1D] tracking-tight leading-tight">
              <span className="text-primary">3개</span>의 면접 요청
              <br />대기 중입니다.
            </p>
          </div>
          <div className="mt-8 flex gap-3 z-10">
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#D61F44] transition-all shadow-md shadow-primary/10">
              요청 확인
            </button>
            <button className="bg-white text-[#1F1D1D] border border-[#EAE5E3] px-8 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
              새 공고 찾기
            </button>
          </div>
        </div>
        {/* 프로필 완성도 */}
        <div className="bg-white p-10 rounded-2xl flex flex-col justify-center items-center text-center border border-[#EAE5E3] shadow-sm">
          <div className="text-5xl font-black text-primary mb-3">98%</div>
          <div className="text-sm font-bold text-[#6B6766] mb-6">프로필 완성도</div>
          <div className="w-full bg-[#FFF0F3] h-3 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[98%] rounded-full shadow-inner" />
          </div>
        </div>
      </div>

      {/* 활성 이력서 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">활성 이력서</h3>
          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            전체 관리
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </button>
        </div>
        <div className="space-y-3">
          <div className="bg-white border border-[#EAE5E3] rounded-2xl p-5 hover:border-primary/30 transition-all group shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFF0F3] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">article</span>
              </div>
              <div>
                <h4 className="font-bold group-hover:text-primary transition-colors">숙련된 홀서빙 및 카페 바리스타 경력 5년</h4>
                <p className="text-xs text-[#6B6766] mt-0.5">최근 수정: 2일 전</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#EAE5E3] group-hover:text-primary transition-colors">chevron_right</span>
          </div>
          <div className="bg-white border border-[#EAE5E3] rounded-2xl p-5 hover:border-primary/30 transition-all group shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFF0F3] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">article</span>
              </div>
              <div>
                <h4 className="font-bold group-hover:text-primary transition-colors">단기 이벤트 및 판촉 행사 도우미 가능</h4>
                <p className="text-xs text-[#6B6766] mt-0.5">최근 수정: 1개월 전</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#EAE5E3] group-hover:text-primary transition-colors">chevron_right</span>
          </div>
        </div>
      </section>

      {/* 최근 리뷰 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">최근 리뷰</h3>
          <button className="text-xs font-bold text-[#6B6766] hover:text-primary transition-colors">전체 보기</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 리뷰 1 */}
          <div className="bg-white border border-[#EAE5E3] rounded-2xl p-6 flex flex-col justify-between hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <span className="text-[10px] text-[#6B6766] font-medium">2024.03.15</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed text-[#1F1D1D] tracking-tight mb-6">
                "지급이 정말 빠르고 요청 사항이 매우 명확해서 좋았습니다. 급한 프로젝트가 있을 때 믿고 함께할 수 있습니다."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[#EAE5E3]/30">
              <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-primary text-[10px] flex items-center justify-center font-bold">JK</div>
              <div>
                <p className="text-xs font-bold text-[#1F1D1D]">김제임스</p>
                <p className="text-[10px] text-[#6B6766] font-medium">서울 에디토리얼 팀장</p>
              </div>
            </div>
          </div>
          {/* 리뷰 2 */}
          <div className="bg-white border border-[#EAE5E3] rounded-2xl p-6 flex flex-col justify-between hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex text-primary">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                  <span className="material-symbols-outlined text-sm">star</span>
                </div>
                <span className="text-[10px] text-[#6B6766] font-medium">2024.03.10</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed text-[#1F1D1D] tracking-tight mb-6">
                "편집 과정 전반에 걸쳐 프로페셔널한 환경과 훌륭한 소통이 인상적이었습니다. 다음에도 꼭 부탁드리고 싶어요."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[#EAE5E3]/30">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 text-[10px] flex items-center justify-center font-bold border border-blue-100">SP</div>
              <div>
                <p className="text-xs font-bold text-[#1F1D1D]">박사라</p>
                <p className="text-[10px] text-[#6B6766] font-medium">콘텐츠 전략가</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

/** 근무 관리 탭 (reference _7) */
function WorkContent() {
  return (
    <section className="flex-grow space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-[#1F1D1D]">근무 관리</h1>
        <p className="text-[#6B6766] text-sm mt-1">현재 진행 중인 지원 현황과 확정된 근무 일정을 확인하세요.</p>
      </header>

      {/* Status Overview Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-[#EAE5E3] shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-[#6B6766] uppercase">지원 중</span>
          <span className="text-3xl font-black text-[#1F1D1D] tracking-tight">12</span>
        </div>
        <div className="bg-primary p-6 rounded-2xl shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-white/80 uppercase">면접 진행</span>
          <span className="text-3xl font-black text-white tracking-tight">3</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#EAE5E3] shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-[#6B6766] uppercase">최종 합격</span>
          <span className="text-3xl font-black text-primary tracking-tight">2</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#EAE5E3] shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-[#6B6766] uppercase">불합격</span>
          <span className="text-3xl font-black text-[#6B6766] opacity-30 tracking-tight">5</span>
        </div>
      </section>

      {/* Application List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">최근 지원 내역</h3>
          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            전체보기 <span className="material-symbols-outlined text-xs">chevron_right</span>
          </button>
        </div>

        {/* 카드 1 - 면접 진행 */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE5E3] shadow-sm group transition-all hover:border-primary/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-grow space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">면접 진행</span>
              <span className="text-[11px] text-[#6B6766] font-medium">지원일: 2024.10.24</span>
            </div>
            <div>
              <h4 className="text-lg font-bold group-hover:text-primary transition-colors">스타벅스 강남대로점</h4>
              <p className="text-sm text-[#6B6766] mt-0.5">홀 혼잡 관리 및 고객 응대 스태프</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-[#1F1D1D]">
                <span className="material-symbols-outlined text-primary text-lg">payments</span>
                <span className="text-sm font-bold">12,500원/hr</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#6B6766]">
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span className="text-sm font-medium">14:00 - 19:00 (5시간)</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
            <button className="flex-1 md:w-32 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-[#D61F44] transition-all shadow-md shadow-primary/10">메시지함</button>
            <button className="flex-1 md:w-32 py-2.5 bg-gray-50 text-[#1F1D1D] border border-[#EAE5E3] font-bold rounded-xl text-xs hover:bg-gray-100 transition-all">공고 보기</button>
          </div>
        </div>

        {/* 카드 2 - 최종 합격 */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE5E3] shadow-sm group transition-all hover:border-primary/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-grow space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">최종 합격</span>
              <span className="text-[11px] text-[#6B6766] font-medium">지원일: 2024.10.20</span>
            </div>
            <div>
              <h4 className="text-lg font-bold group-hover:text-primary transition-colors">CU 편의점 역삼역점</h4>
              <p className="text-sm text-[#6B6766] mt-0.5">평일 야간 물류 정리 및 카운터</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-[#1F1D1D]">
                <span className="material-symbols-outlined text-primary text-lg">payments</span>
                <span className="text-sm font-bold">11,000원/hr</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#6B6766]">
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span className="text-sm font-medium">22:00 - 06:00 (8시간)</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
            <button className="flex-1 md:w-32 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-[#D61F44] transition-all shadow-md shadow-primary/10">확정하기</button>
            <button className="flex-1 md:w-32 py-2.5 bg-gray-50 text-[#1F1D1D] border border-[#EAE5E3] font-bold rounded-xl text-xs hover:bg-gray-100 transition-all">공고 보기</button>
          </div>
        </div>

        {/* 카드 3 - 지원 중 */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE5E3] shadow-sm group transition-all hover:border-primary/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-grow space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 text-[#6B6766] text-[10px] font-bold px-2 py-0.5 rounded">지원 중</span>
              <span className="text-[11px] text-[#6B6766] font-medium">지원일: 2024.10.25</span>
            </div>
            <div>
              <h4 className="text-lg font-bold group-hover:text-primary transition-colors">파리바게뜨 신사점</h4>
              <p className="text-sm text-[#6B6766] mt-0.5">제빵 보조 및 매장 진열</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-[#1F1D1D]">
                <span className="material-symbols-outlined text-primary text-lg">payments</span>
                <span className="text-sm font-bold">10,500원/hr</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#6B6766]">
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span className="text-sm font-medium">07:00 - 12:00 (5시간)</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
            <button className="flex-1 md:w-32 py-2.5 bg-gray-50 text-[#1F1D1D] border border-[#EAE5E3] font-bold rounded-xl text-xs hover:bg-gray-100 transition-all">지원 취소</button>
            <button className="flex-1 md:w-32 py-2.5 bg-gray-50 text-[#1F1D1D] border border-[#EAE5E3] font-bold rounded-xl text-xs hover:bg-gray-100 transition-all">공고 보기</button>
          </div>
        </div>
      </section>
    </section>
  );
}

/** 이력서 수정 폼 (reference _4) */
function ResumeEditForm({ onBack }) {
  return (
    <section className="flex-grow">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#6B6766] hover:text-primary transition-colors font-bold text-sm"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          목록으로
        </button>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1F1D1D]">이력서 수정</h1>
        <p className="text-[#6B6766] mt-1 text-sm font-medium">귀하의 전문성과 경력을 최신 정보로 업데이트하여 더 나은 기회를 잡으세요.</p>
      </div>
      <div className="space-y-6">
        {/* 기본 정보 */}
        <section className="bg-white p-8 rounded-2xl border border-[#EAE5E3] shadow-sm space-y-8">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-primary uppercase tracking-wider">이력서 제목</label>
            <input
              type="text"
              placeholder="예: 성실하고 실력 있는 서빙 전문 대타입니다"
              className="w-full bg-gray-50 border border-[#EAE5E3] rounded-xl py-4 px-4 text-base font-bold text-[#1F1D1D] placeholder:text-[#6B6766]/40 transition-all focus:bg-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider">전문 분야</label>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-[#EAE5E3] rounded-xl py-3.5 px-4 appearance-none font-semibold text-sm focus:bg-white focus:outline-none focus:border-primary">
                  <option>분야를 선택해주세요</option>
                  <option>외식·조리</option>
                  <option>매장관리·판매</option>
                  <option>배달·운전</option>
                  <option>서비스·기타</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B6766]">expand_more</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider">최종학력</label>
                <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                  <span className="material-symbols-outlined text-[14px]">refresh</span> 내 정보에서 불러오기
                </button>
              </div>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-[#EAE5E3] rounded-xl py-3.5 px-4 appearance-none font-semibold text-sm focus:bg-white focus:outline-none focus:border-primary">
                  <option>학력을 선택해주세요</option>
                  <option>대학(4년) 졸업</option>
                  <option>대학(2,3년) 졸업</option>
                  <option>대학원 석사 졸업</option>
                  <option>고등학교 졸업</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B6766]">expand_more</span>
              </div>
            </div>
          </div>
        </section>

        {/* 경력 사항 */}
        <section className="bg-white p-8 rounded-2xl border border-[#EAE5E3] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-extrabold text-[#1F1D1D]">경력 사항</h2>
            <button className="text-[11px] font-bold text-primary border border-primary/20 px-4 py-1.5 rounded-full hover:bg-[#FFF0F3] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">sync</span> 내 정보에서 불러오기
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 items-end bg-gray-50/50 p-5 rounded-xl border border-[#EAE5E3]/60">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#6B6766] block mb-1.5">근무처</label>
                  <input type="text" placeholder="회사명 또는 가게명" className="w-full bg-white border border-[#EAE5E3] rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6B6766] block mb-1.5">직무</label>
                  <input type="text" placeholder="예: 홀서빙" className="w-full bg-white border border-[#EAE5E3] rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6B6766] block mb-1.5">근무기간</label>
                  <input type="text" placeholder="YYYY.MM - YYYY.MM" className="w-full bg-white border border-[#EAE5E3] rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-primary/50" />
                </div>
              </div>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#EAE5E3] text-[#6B6766] hover:text-primary hover:border-primary/30 transition-colors bg-white">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
            <button className="w-full border-2 border-dashed border-[#EAE5E3]/60 py-5 rounded-2xl flex flex-col items-center justify-center gap-1 text-[#6B6766] hover:bg-[#FFF0F3]/10 hover:border-primary/30 transition-all group">
              <div className="w-8 h-8 rounded-full border border-[#EAE5E3] flex items-center justify-center mb-1 group-hover:border-primary/30 group-hover:bg-white">
                <span className="material-symbols-outlined text-xl group-hover:text-primary">add</span>
              </div>
              <span className="text-xs font-bold">경력 추가하기</span>
            </button>
          </div>
        </section>

        {/* 자격증 */}
        <section className="bg-white p-8 rounded-2xl border border-[#EAE5E3] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-extrabold text-[#1F1D1D]">자격증</h2>
            <button className="text-[11px] font-bold text-primary border border-primary/20 px-4 py-1.5 rounded-full hover:bg-[#FFF0F3] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">sync</span> 내 정보에서 불러오기
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-[#EAE5E3]">
              <div className="flex-1">
                <div className="text-[10px] font-bold text-[#6B6766]">자격증 명</div>
                <div className="font-bold text-[#1F1D1D] text-sm">보건증 (유효함)</div>
              </div>
              <button className="text-[#6B6766] hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-[#EAE5E3]">
              <div className="flex-1">
                <div className="text-[10px] font-bold text-[#6B6766]">자격증 명</div>
                <div className="font-bold text-[#1F1D1D] text-sm">운전면허증 (1종 보통)</div>
              </div>
              <button className="text-[#6B6766] hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>
          <button className="w-full border-2 border-dashed border-[#EAE5E3]/60 py-5 rounded-2xl flex flex-col items-center justify-center gap-1 text-[#6B6766] hover:bg-[#FFF0F3]/10 hover:border-primary/30 transition-all group">
            <div className="w-8 h-8 rounded-full border border-[#EAE5E3] flex items-center justify-center mb-1 group-hover:border-primary/30 group-hover:bg-white">
              <span className="material-symbols-outlined text-xl group-hover:text-primary">add</span>
            </div>
            <span className="text-xs font-bold">자격증 추가하기</span>
          </button>
        </section>

        {/* 자기소개 & 노출 설정 */}
        <section className="bg-white p-8 rounded-2xl border border-[#EAE5E3] shadow-sm space-y-8">
          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider">자기소개</label>
            <textarea
              className="w-full min-h-[220px] bg-gray-50 border border-[#EAE5E3] rounded-xl py-4 px-4 text-sm font-medium resize-none leading-relaxed focus:bg-white focus:outline-none focus:border-primary"
              placeholder="자신의 강점이나 대타 경험을 자유롭게 서술해주세요. (최소 100자)"
            />
          </div>
          <div className="pt-8 border-t border-[#EAE5E3]">
            <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider block mb-4">인재정보 노출 설정</label>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="visibility" defaultChecked className="accent-primary" />
                <span className="text-sm font-bold text-[#1F1D1D] group-hover:text-primary transition-colors">노출함</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="visibility" className="accent-primary" />
                <span className="text-sm font-bold text-[#1F1D1D] group-hover:text-primary transition-colors">노출하지 않음</span>
              </label>
            </div>
            <p className="mt-3 text-[11px] font-medium text-[#6B6766]">노출 시 사장님들이 직접 제안을 보낼 수 있습니다.</p>
          </div>
        </section>

        {/* 저장 버튼 */}
        <div className="flex justify-end gap-3 pt-6">
          <button onClick={onBack} className="px-8 py-3.5 bg-gray-100 text-[#1F1D1D] font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">취소</button>
          <button className="px-14 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-[#D61F44] active:scale-[0.98] transition-all text-sm shadow-md shadow-primary/10">저장하기</button>
        </div>
      </div>

      {/* 실시간 추천 알림 (reference _4) */}
      <div className="fixed bottom-8 right-8 bg-white border border-primary/20 text-[#1F1D1D] px-6 py-4 rounded-2xl flex items-center gap-4 shadow-xl z-50">
        <div className="w-10 h-10 rounded-full bg-[#FFF0F3] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
        </div>
        <div className="text-sm">
          <div className="font-black text-[#1F1D1D]">실시간 추천 알림</div>
          <div className="text-[11px] font-medium text-[#6B6766] mt-0.5">이력서를 업데이트하면 적합한 일자리를 더 빨리 찾을 수 있습니다!</div>
        </div>
      </div>
    </section>
  );
}

/** 이력서 관리 탭 (reference _6) */
function ResumeContent() {
  const [view, setView] = useState('list');

  if (view === 'edit') {
    return <ResumeEditForm onBack={() => setView('list')} />;
  }

  return (
    <section className="flex-grow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#1F1D1D]">이력서 관리</h1>
          <p className="text-[#6B6766] mt-1 text-sm">작성하신 이력서를 관리하고 기본 이력서를 설정하세요.</p>
        </div>
        <button
          onClick={() => setView('edit')}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-[#D61F44] transition-transform active:scale-95 shadow-md shadow-primary/10"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span className="text-sm">새 이력서 작성</span>
        </button>
      </div>

      {/* Resume Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 대표 이력서 카드 */}
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border border-primary/20 shadow-sm ring-1 ring-primary/5">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-[#FFF0F3] text-primary text-[10px] font-bold px-3 py-1 rounded-full">대표 이력서</span>
          </div>
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#FFF0F3] flex-shrink-0 border border-[#EAE5E3] flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">person</span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1F1D1D] leading-snug">숙련된 홀서빙 및 카페 바리스타 경력 5년</h3>
              <p className="text-[11px] font-medium text-[#6B6766] mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">history</span> 최종 수정일: 2024. 05. 12
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-50 border border-[#EAE5E3] px-2 py-0.5 rounded text-[10px] font-bold text-[#6B6766]">#바리스타</span>
              <span className="bg-gray-50 border border-[#EAE5E3] px-2 py-0.5 rounded text-[10px] font-bold text-[#6B6766]">#서빙</span>
              <span className="bg-gray-50 border border-[#EAE5E3] px-2 py-0.5 rounded text-[10px] font-bold text-[#6B6766]">#보건증보유</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-8">
            <button
              onClick={() => setView('edit')}
              className="flex-1 bg-white text-[#1F1D1D] border border-[#EAE5E3] py-2.5 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors"
            >
              수정
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#EAE5E3] text-[#6B6766] hover:text-primary hover:border-primary/30 transition-colors">
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>

        {/* 일반 이력서 카드 1 */}
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border border-[#EAE5E3] shadow-sm hover:border-primary/20 transition-all group">
          <div className="absolute top-0 right-0 p-4">
            <button className="text-[10px] font-bold text-primary border border-primary/30 px-3 py-1 rounded-full hover:bg-[#FFF0F3] transition-colors bg-white">대표 설정</button>
          </div>
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-[#EAE5E3] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#6B6766] text-3xl">person</span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1F1D1D] leading-snug group-hover:text-primary transition-colors">단기 이벤트 및 판촉 행사 도우미 가능</h3>
              <p className="text-[11px] font-medium text-[#6B6766] mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">history</span> 최종 수정일: 2024. 04. 28
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-50 border border-[#EAE5E3] px-2 py-0.5 rounded text-[10px] font-bold text-[#6B6766]">#이벤트</span>
              <span className="bg-gray-50 border border-[#EAE5E3] px-2 py-0.5 rounded text-[10px] font-bold text-[#6B6766]">#판촉</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-8">
            <button
              onClick={() => setView('edit')}
              className="flex-1 bg-white text-[#1F1D1D] border border-[#EAE5E3] py-2.5 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors"
            >
              수정
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#EAE5E3] text-[#6B6766] hover:text-primary hover:border-primary/30 transition-colors">
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>

        {/* 일반 이력서 카드 2 */}
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border border-[#EAE5E3] shadow-sm hover:border-primary/20 transition-all group">
          <div className="absolute top-0 right-0 p-4">
            <button className="text-[10px] font-bold text-primary border border-primary/30 px-3 py-1 rounded-full hover:bg-[#FFF0F3] transition-colors bg-white">대표 설정</button>
          </div>
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-[#EAE5E3] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#6B6766] text-3xl">person</span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1F1D1D] leading-snug group-hover:text-primary transition-colors">창고 관리 및 물류 패킹 알바 경력</h3>
              <p className="text-[11px] font-medium text-[#6B6766] mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">history</span> 최종 수정일: 2024. 02. 15
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-50 border border-[#EAE5E3] px-2 py-0.5 rounded text-[10px] font-bold text-[#6B6766]">#물류</span>
              <span className="bg-gray-50 border border-[#EAE5E3] px-2 py-0.5 rounded text-[10px] font-bold text-[#6B6766]">#단순노무</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-8">
            <button
              onClick={() => setView('edit')}
              className="flex-1 bg-white text-[#1F1D1D] border border-[#EAE5E3] py-2.5 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors"
            >
              수정
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#EAE5E3] text-[#6B6766] hover:text-primary hover:border-primary/30 transition-colors">
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>

        {/* 추가 이력서 플레이스홀더 */}
        <div
          onClick={() => setView('edit')}
          className="border-2 border-dashed border-[#EAE5E3] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px] text-[#6B6766] group hover:border-primary/50 hover:bg-[#FFF0F3]/10 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-[#EAE5E3] group-hover:border-primary/30 shadow-sm transition-all mb-4">
            <span className="material-symbols-outlined text-2xl text-[#6B6766] group-hover:text-primary transition-colors">add</span>
          </div>
          <p className="font-bold text-sm">추가 이력서 작성</p>
          <p className="text-[10px] mt-1 text-[#6B6766]/70">최대 5개까지 등록 가능합니다.</p>
        </div>
      </div>

      {/* 작성 팁 그리드 (reference _2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-[#EAE5E3] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined">lightbulb</span>
          </div>
          <div>
            <h3 className="font-bold text-[#1F1D1D] text-sm">작성 팁: 사진을 등록하세요!</h3>
            <p className="text-xs text-[#6B6766] mt-1.5 font-medium leading-relaxed">이력서 사진이 있는 지원자는 연락을 받을 확률이 3.5배 더 높습니다.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-[#EAE5E3] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined">verified</span>
          </div>
          <div>
            <h3 className="font-bold text-[#1F1D1D] text-sm">본인 인증 완료</h3>
            <p className="text-xs text-[#6B6766] mt-1.5 font-medium leading-relaxed">인증된 회원님의 이력서는 신뢰 마크와 함께 노출됩니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 리뷰 관리 탭 (reference _5) */
function ReviewContent() {
  const [reviewTab, setReviewTab] = React.useState('received');

  return (
    <section className="flex-grow space-y-8">
      <header className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight text-[#1F1D1D] mb-1">리뷰 관리</h1>
          <p className="text-[#6B6766] text-sm font-medium">
            {reviewTab === 'received'
              ? <>총 <span className="text-primary font-bold">3건</span>의 리뷰를 받았습니다.</>
              : <>총 <span className="text-primary font-bold">3건</span>의 리뷰를 작성했습니다.</>
            }
          </p>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-[#EAE5E3]">
        <CommonButton
          onClick={() => setReviewTab('received')}
          variant="toggle"
          size="tab"
          active={reviewTab === 'received'}
          activeClassName="text-primary"
          inactiveClassName="text-[#6B6766] hover:text-[#1F1D1D]"
          className="relative rounded-none px-6"
        >
          내가 받은 리뷰
          {reviewTab === 'received' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </CommonButton>
        <CommonButton
          onClick={() => setReviewTab('written')}
          variant="toggle"
          size="tab"
          active={reviewTab === 'written'}
          activeClassName="text-primary"
          inactiveClassName="text-[#6B6766] hover:text-[#1F1D1D]"
          className="relative rounded-none px-6"
        >
          내가 쓴 리뷰
          {reviewTab === 'written' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </CommonButton>
      </div>

      {/* 내가 받은 리뷰 탭 */}
      {reviewTab === 'received' && (
        <>
          <div className="flex items-end justify-between mb-2">
            <div />
            <div className="flex gap-2">
              <button className="bg-white border border-[#EAE5E3] px-4 py-2 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">최신순</button>
              <button className="bg-white border border-[#EAE5E3] px-4 py-2 text-xs font-medium rounded-lg text-[#6B6766] opacity-50">오래된순</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* 받은 리뷰 카드 1 */}
            <article className="bg-white border border-[#EAE5E3] p-6 rounded-2xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 shrink-0">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl border border-[#EAE5E3]/50 mb-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#6B6766] text-3xl">person</span>
                  </div>
                  <h3 className="font-bold text-base text-[#1F1D1D] leading-tight mb-1">김제임스</h3>
                  <p className="text-xs font-medium text-[#6B6766] mb-3">서울 에디토리얼 팀장</p>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                      <span className="text-[10px] text-[#6B6766] font-medium">2024.05.15</span>
                    </div>
                    <h4 className="font-bold text-[#1F1D1D] mb-2 text-sm">"지급이 정말 빠르고 요청 사항이 매우 명확해서 좋았습니다."</h4>
                    <p className="text-sm text-[#6B6766] leading-relaxed">
                      급한 프로젝트가 있을 때 믿고 함께할 수 있는 신뢰할 수 있는 파트너입니다.
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3 pt-4 border-t border-[#EAE5E3]/30">
                    <button className="text-xs font-bold text-primary hover:underline">답글 달기</button>
                  </div>
                </div>
              </div>
            </article>

            {/* 받은 리뷰 카드 2 */}
            <article className="bg-white border border-[#EAE5E3] p-6 rounded-2xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 shrink-0">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl border border-[#EAE5E3]/50 mb-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-500 text-3xl">person</span>
                  </div>
                  <h3 className="font-bold text-base text-[#1F1D1D] leading-tight mb-1">박사라</h3>
                  <p className="text-xs font-medium text-[#6B6766] mb-3">콘텐츠 전략가</p>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-primary">
                        {[...Array(4)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                        <span className="material-symbols-outlined text-sm">star</span>
                      </div>
                      <span className="text-[10px] text-[#6B6766] font-medium">2024.03.10</span>
                    </div>
                    <h4 className="font-bold text-[#1F1D1D] mb-2 text-sm">"프로페셔널한 환경과 훌륭한 소통이 인상적이었습니다."</h4>
                    <p className="text-sm text-[#6B6766] leading-relaxed">
                      다음에도 꼭 부탁드리고 싶은 좋은 협력자입니다.
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3 pt-4 border-t border-[#EAE5E3]/30">
                    <button className="text-xs font-bold text-primary hover:underline">답글 달기</button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </>
      )}

      {/* 내가 쓴 리뷰 탭 */}
      {reviewTab === 'written' && (
        <>
          <div className="flex items-end justify-between mb-2">
            <div />
            <div className="flex gap-2">
              <button className="bg-white border border-[#EAE5E3] px-4 py-2 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">최신순</button>
              <button className="bg-white border border-[#EAE5E3] px-4 py-2 text-xs font-medium rounded-lg text-[#6B6766] opacity-50">오래된순</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* 쓴 리뷰 카드 1 */}
            <article className="bg-white border border-[#EAE5E3] p-6 rounded-2xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 shrink-0">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl border border-[#EAE5E3]/50 mb-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#6B6766] text-3xl">store</span>
                  </div>
                  <h3 className="font-bold text-base text-[#1F1D1D] leading-tight mb-1">메종 드 카페 성수점</h3>
                  <p className="text-xs font-medium text-[#6B6766] mb-3">근무기간: 3개월</p>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-primary">
                        {[...Array(4)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                        <span className="material-symbols-outlined text-sm">star</span>
                      </div>
                      <span className="text-[10px] text-[#6B6766] font-medium">2024.05.15</span>
                    </div>
                    <h4 className="font-bold text-[#1F1D1D] mb-2 text-sm">"업무 강도는 높지만 급여 지급이 매우 정확합니다."</h4>
                    <p className="text-sm text-[#6B6766] leading-relaxed">
                      성수동 핫플레이스라 주말에는 매우 바쁘지만 시스템이 잘 잡혀있어 혼란스럽지 않았습니다. 점장님이 매우 친절하시고 식대 지원도 잘 나옵니다.
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3 pt-4 border-t border-[#EAE5E3]/30">
                    <button className="text-xs font-bold text-primary hover:underline">수정</button>
                    <button className="text-xs font-bold text-[#6B6766]/50 hover:text-red-500 transition-colors">삭제</button>
                  </div>
                </div>
              </div>
            </article>

            {/* 쓴 리뷰 카드 2 */}
            <article className="bg-white border border-[#EAE5E3] p-6 rounded-2xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 shrink-0">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl border border-[#EAE5E3]/50 mb-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#6B6766] text-3xl">store</span>
                  </div>
                  <h3 className="font-bold text-base text-[#1F1D1D] leading-tight mb-1">한라 로지스틱스</h3>
                  <p className="text-xs font-medium text-[#6B6766] mb-3">근무기간: 1개월 (단기)</p>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                      <span className="text-[10px] text-[#6B6766] font-medium">2024.04.20</span>
                    </div>
                    <h4 className="font-bold text-[#1F1D1D] mb-2 text-sm">"긴급 급구 대타였는데 매칭이 빨라서 좋았습니다."</h4>
                    <p className="text-sm text-[#6B6766] leading-relaxed">
                      물류 상하차 업무라 체력적으로 힘들긴 했지만, 긴급 건이라 시급이 다른 곳보다 훨씬 높았습니다. 현장 관리자분들도 친절하게 안내해주셨습니다.
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3 pt-4 border-t border-[#EAE5E3]/30">
                    <button className="text-xs font-bold text-primary hover:underline">수정</button>
                    <button className="text-xs font-bold text-[#6B6766]/50 hover:text-red-500 transition-colors">삭제</button>
                  </div>
                </div>
              </div>
            </article>

            {/* 쓴 리뷰 카드 3 */}
            <article className="bg-white border border-[#EAE5E3] p-6 rounded-2xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 shrink-0">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl border border-[#EAE5E3]/50 mb-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#6B6766] text-3xl">store</span>
                  </div>
                  <h3 className="font-bold text-base text-[#1F1D1D] leading-tight mb-1">디에타 에디토리얼</h3>
                  <p className="text-xs font-medium text-[#6B6766] mb-3">근무기간: 2주</p>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-primary">
                        {[...Array(3)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                        {[...Array(2)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm">star</span>
                        ))}
                      </div>
                      <span className="text-[10px] text-[#6B6766] font-medium">2024.03.11</span>
                    </div>
                    <h4 className="font-bold text-[#1F1D1D] mb-2 text-sm">"사무 보조 및 데이터 라벨링 단기 대타 후기"</h4>
                    <p className="text-sm text-[#6B6766] leading-relaxed">
                      사무실 환경이 쾌적하고 자유로운 분위기입니다. 업무 지시가 명확해서 금방 적응할 수 있었습니다.
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3 pt-4 border-t border-[#EAE5E3]/30">
                    <button className="text-xs font-bold text-primary hover:underline">수정</button>
                    <button className="text-xs font-bold text-[#6B6766]/50 hover:text-red-500 transition-colors">삭제</button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </>
      )}

      {/* Pagination */}
      {(reviewTab === 'received' || reviewTab === 'written') && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <CommonButton variant="pagination" size="square">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </CommonButton>
            <div className="flex items-center gap-1">
              <CommonButton variant="pagination" size="square" active>1</CommonButton>
              <CommonButton variant="pagination" size="square">2</CommonButton>
              <CommonButton variant="pagination" size="square">3</CommonButton>
            </div>
            <CommonButton variant="pagination" size="square">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </CommonButton>
          </div>
      )}
    </section>
  );
}

/** 정보 수정 탭 (reference _1) */
function InfoEditContent() {
  const [educations, setEducations] = useState([
    { school: '한국대학교', major: '영상디자인학부', type: '대학교 (4년)', status: '졸업' }
  ]);
  const [experiences, setExperiences] = useState([
    { company: '(주)미디어웍스', position: '편집팀 대리', startDate: '2020-03-01', endDate: '2023-12-31', duties: '유튜브 채널 영상 기획 및 종합 편집, 모션 그래픽 제작' }
  ]);
  const [certifications, setCertifications] = useState([
    { name: 'Adobe Certified Professional', issuer: 'Adobe', date: '2022-05-15' }
  ]);

  const addEducation = () => setEducations([...educations, { school: '', major: '', type: '대학교 (4년)', status: '졸업' }]);
  const removeEducation = (idx) => setEducations(educations.filter((_, i) => i !== idx));

  const addExperience = () => setExperiences([...experiences, { company: '', position: '', startDate: '', endDate: '', duties: '' }]);
  const removeExperience = (idx) => setExperiences(experiences.filter((_, i) => i !== idx));

  const addCertification = () => setCertifications([...certifications, { name: '', issuer: '', date: '' }]);
  const removeCertification = (idx) => setCertifications(certifications.filter((_, i) => i !== idx));

  return (
    <section className="flex-grow space-y-8">
      <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#EAE5E3] shadow-sm">
        <header className="mb-10">
          <h3 className="text-3xl font-black tracking-tight text-[#1F1D1D] mb-2">정보 수정</h3>
          <p className="text-[#6B6766] font-medium text-sm">회원님의 소중한 정보를 안전하게 관리하세요.</p>
        </header>
        <form className="space-y-12">
          {/* 프로필 사진 */}
          <div className="flex items-center space-x-8 pb-10 border-b border-[#EAE5E3]/50">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#FFF0F3] shadow-inner bg-gray-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#6B6766] text-6xl">person</span>
              </div>
              <button
                type="button"
                className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-xl shadow-lg hover:scale-105 transition-transform border-2 border-white"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1">프로필 사진</h4>
              <p className="text-[#6B6766] text-xs font-medium">JPG, PNG 파일 (최대 5MB)</p>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="space-y-8">
            <h4 className="text-xl font-bold text-[#1F1D1D]">기본 정보</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">이름</label>
                <input
                  type="text"
                  defaultValue="김대타"
                  className="w-full bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">휴대폰 번호</label>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    defaultValue="010-1234-5678"
                    className="flex-grow bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                  />
                  <button type="button" className="px-6 bg-gray-100 text-[#1F1D1D] text-xs font-bold rounded-xl whitespace-nowrap hover:bg-gray-200 transition-colors border border-[#EAE5E3]">변경</button>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">이메일 주소</label>
                <input
                  type="email"
                  defaultValue="daeta@example.com"
                  className="w-full bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                />
              </div>
            </div>
          </div>

          {/* 비밀번호 변경 */}
          <div className="space-y-8 pt-4">
            <h4 className="text-xl font-bold text-[#1F1D1D]">비밀번호 변경</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">현재 비밀번호</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">새 비밀번호</label>
                <input
                  type="password"
                  placeholder="새 비밀번호 입력"
                  className="w-full bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                />
              </div>
            </div>
          </div>

          {/* 학력 */}
          <div className="space-y-8 pt-4 border-t border-[#EAE5E3]/50">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-xl font-bold text-[#1F1D1D]">학력 (Education)</h4>
                <p className="text-xs text-[#6B6766] mt-1">최종 학력을 포함하여 입력해 주세요.</p>
              </div>
              <button type="button" onClick={addEducation} className="flex items-center gap-1 text-primary text-sm font-bold hover:underline">
                <span className="material-symbols-outlined text-base">add_circle</span> 추가
              </button>
            </div>
            <div className="space-y-4">
              {educations.map((edu, idx) => (
                <div key={idx} className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#EAE5E3] space-y-6 relative group">
                  <button type="button" onClick={() => removeEducation(idx)} className="absolute top-4 right-4 text-[#6B6766] hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">학교명</label>
                      <input
                        type="text"
                        defaultValue={edu.school}
                        className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">전공</label>
                      <input
                        type="text"
                        defaultValue={edu.major}
                        className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">구분</label>
                      <select className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm appearance-none">
                        <option>고등학교</option>
                        <option selected={edu.type === '대학교 (4년)'}>대학교 (4년)</option>
                        <option>대학원</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">상태</label>
                      <select className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm appearance-none">
                        <option selected={edu.status === '졸업'}>졸업</option>
                        <option>재학 중</option>
                        <option>휴학</option>
                        <option>수료</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 경력 */}
          <div className="space-y-8 pt-4 border-t border-[#EAE5E3]/50">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-xl font-bold text-[#1F1D1D]">경력 (Experience)</h4>
                <p className="text-xs text-[#6B6766] mt-1">참여했던 프로젝트나 소속 기업을 입력해 주세요.</p>
              </div>
              <button type="button" onClick={addExperience} className="flex items-center gap-1 text-primary text-sm font-bold hover:underline">
                <span className="material-symbols-outlined text-base">add_circle</span> 추가
              </button>
            </div>
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={idx} className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#EAE5E3] space-y-6 relative">
                  <button type="button" onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-[#6B6766] hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">회사명 / 조직명</label>
                      <input
                        type="text"
                        defaultValue={exp.company}
                        className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">부서 및 직책</label>
                      <input
                        type="text"
                        defaultValue={exp.position}
                        className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">근무 기간 (시작)</label>
                      <input
                        type="date"
                        defaultValue={exp.startDate}
                        className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">근무 기간 (종료)</label>
                      <input
                        type="date"
                        defaultValue={exp.endDate}
                        className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">주요 업무</label>
                      <textarea
                        defaultValue={exp.duties}
                        placeholder="담당하셨던 주요 업무를 요약해 주세요."
                        className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 자격증 */}
          <div className="space-y-8 pt-4 border-t border-[#EAE5E3]/50">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-xl font-bold text-[#1F1D1D]">자격증 (Certifications)</h4>
                <p className="text-xs text-[#6B6766] mt-1">업무 관련 자격증을 입력해 주세요.</p>
              </div>
              <button type="button" onClick={addCertification} className="flex items-center gap-1 text-primary text-sm font-bold hover:underline">
                <span className="material-symbols-outlined text-base">add_circle</span> 추가
              </button>
            </div>
            <div className="space-y-4">
              {certifications.map((cert, idx) => (
                <div key={idx} className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#EAE5E3] space-y-6 relative">
                  <button type="button" onClick={() => removeCertification(idx)} className="absolute top-4 right-4 text-[#6B6766] hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">자격증 명</label>
                      <input
                        type="text"
                        defaultValue={cert.name}
                        className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                      />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">발행 기관</label>
                      <input
                        type="text"
                        defaultValue={cert.issuer}
                        className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                      />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                      <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">취득 일자</label>
                      <input
                        type="date"
                        defaultValue={cert.date}
                        className="w-full bg-white border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 저장 푸터 */}
          <div className="pt-8 flex justify-end items-center space-x-4 border-t border-[#EAE5E3]/50">
            <button type="button" className="px-8 py-4 text-[#6B6766] text-sm font-bold hover:bg-gray-50 rounded-xl transition-all">취소</button>
            <button type="submit" className="px-12 py-4 bg-primary text-white font-bold text-base rounded-xl shadow-lg shadow-primary/20 hover:bg-[#D61F44] transition-all active:scale-[0.98]">저장하기</button>
          </div>
        </form>

        {/* 주의 사항 */}
        <div className="mt-12 p-6 rounded-2xl bg-[#FFF0F3]/50 border border-primary/10 flex items-start space-x-4">
          <span className="material-symbols-outlined text-primary mt-0.5">info</span>
          <div>
            <p className="text-sm font-bold text-[#1F1D1D]">주의 사항</p>
            <p className="text-xs text-[#6B6766] font-medium mt-1 leading-relaxed">
              중요 개인 정보 변경 시 추가적인 본인 인증이 필요할 수 있습니다. 비밀번호는 8자 이상, 영문/숫자/특수문자를 조합하여 설정해 주세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   스크랩한 공고 탭
───────────────────────────────────────────── */
const SCRAP_JOBS = [
  {
    id: 1,
    company: '강남역 카페 테라스',
    title: '주말 바리스타 단기 알바 모집',
    tags: ['바리스타', '주말', '단기'],
    pay: '시급 12,000원',
    location: '서울 강남구',
    deadline: '2026-04-25',
    logo: null,
  },
  {
    id: 2,
    company: '역삼동 피트니스 센터',
    title: '오전 헬스 트레이너 파트타임',
    tags: ['트레이너', '오전', '파트타임'],
    pay: '시급 15,000원',
    location: '서울 강남구',
    deadline: '2026-04-30',
    logo: null,
  },
  {
    id: 3,
    company: '성수동 팝업스토어',
    title: '팝업 행사 스태프 모집 (5일)',
    tags: ['행사스태프', '단기', '5일'],
    pay: '일급 100,000원',
    location: '서울 성동구',
    deadline: '2026-05-03',
    logo: null,
  },
  {
    id: 4,
    company: '홍대 이자카야 다이닝',
    title: '홀 서빙 야간 근무자 구합니다',
    tags: ['홀서빙', '야간', '장기'],
    pay: '시급 13,000원',
    location: '서울 마포구',
    deadline: '2026-05-10',
    logo: null,
  },
];

function ScrapContent() {
  const [scraps, setScraps] = React.useState(SCRAP_JOBS);

  const removeScrap = (id) => {
    setScraps((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <section className="flex-grow space-y-6">
      {/* 헤더 */}
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
                {/* 로고 */}
                <div className="w-12 h-12 bg-[#FFF0F3] rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-2xl">apartment</span>
                </div>

                {/* 내용 */}
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

                {/* 액션 */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => removeScrap(job.id)}
                    className="p-2 rounded-xl hover:bg-[#FFF0F3] transition-colors group/btn"
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

      {/* 안내 */}
      <div className="p-5 rounded-2xl bg-[#FFF0F3]/50 border border-primary/10 flex items-start gap-3">
        <span className="material-symbols-outlined text-primary mt-0.5 text-sm">info</span>
        <p className="text-xs text-[#6B6766] font-medium leading-relaxed">
          북마크 아이콘을 클릭하면 스크랩이 해제됩니다. 마감된 공고는 자동으로 목록에서 제거됩니다.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   메인 페이지 컴포넌트
───────────────────────────────────────────── */
export default function PersonalMyPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarMenus = [
    { key: 'dashboard', label: '대시보드', icon: 'dashboard' },
    { key: 'work',      label: '근무 관리',  icon: 'work_history' },
    { key: 'resume',    label: '이력서 관리', icon: 'description' },
    { key: 'review',    label: '리뷰 관리',  icon: 'rate_review' },
    { key: 'scrap',     label: '스크랩 공고', icon: 'bookmark' },
    { key: 'info',      label: '정보 수정',  icon: 'person_edit' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardContent />;
      case 'work':      return <WorkContent />;
      case 'resume':    return <ResumeContent />;
      case 'review':    return <ReviewContent />;
      case 'scrap':     return <ScrapContent />;
      case 'info':      return <InfoEditContent />;
      default:          return <DashboardContent />;
    }
  };

  return (
    <div className="bg-[#F9F9F9] text-[#1F1D1D] min-h-screen flex flex-col">
      <TopNavBarLoggedIn />

      <main className="flex-grow w-full custom-container pt-28 pb-12 flex flex-col lg:flex-row gap-8">
        {/* 사이드바 */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white p-8 rounded-2xl flex flex-col gap-8 border border-[#EAE5E3] shadow-sm sticky top-24">
            {/* 프로필 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#FFF0F3] shadow-inner bg-gray-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#6B6766] text-5xl">person</span>
              </div>
              <h2 className="text-xl font-bold text-[#1F1D1D]">김대타</h2>
              <p className="text-sm font-medium text-[#6B6766]">프리랜서 대타</p>
              <CommonButton
                onClick={() => setActiveTab('info')}
                variant="subtle"
                size="sm"
                fullWidth
                className="mt-4 text-xs border border-[#EAE5E3]"
              >
                프로필 수정
              </CommonButton>
            </div>

            {/* 메뉴 */}
            <nav className="flex flex-col space-y-1">
              {sidebarMenus.map(({ key, label, icon }) => (
                <CommonButton
                  key={key}
                  onClick={() => setActiveTab(key)}
                  variant="toggle"
                  size="tab"
                  fullWidth
                  active={activeTab === key}
                  activeClassName="bg-[#FFF0F3] text-primary font-bold"
                  inactiveClassName="text-[#6B6766] hover:bg-[#FFF0F3]/50 hover:text-primary"
                  className="justify-start px-4"
                  icon={(
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={activeTab === key ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {icon}
                    </span>
                  )}
                  iconPosition="left"
                >
                  <span>{label}</span>
                </CommonButton>
              ))}
              <CommonButton
                variant="toggle"
                size="tab"
                fullWidth
                inactiveClassName="text-[#6B6766] hover:bg-[#FFF0F3]/50 hover:text-primary"
                className="justify-start px-4"
                icon={<span className="material-symbols-outlined text-[20px]">logout</span>}
                iconPosition="left"
              >
                <span>로그아웃</span>
              </CommonButton>
            </nav>

            {/* 회원 탈퇴 */}
            <div className="pt-8 border-t border-[#EAE5E3] mt-auto flex flex-col gap-2">
              <button className="text-xs text-[#6B6766] hover:text-primary transition-colors text-left px-4">회원 탈퇴하기</button>
            </div>
          </div>
        </aside>

        {/* 메인 컨텐츠 */}
        {renderContent()}
      </main>

      <AppFooter />
    </div>
  );
}

