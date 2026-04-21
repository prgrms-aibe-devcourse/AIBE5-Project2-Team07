import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

/* ──────────────────────────────────────────
   더미 데이터 (실제 서비스에서는 API/props 로 대체)
────────────────────────────────────────── */
const talentData = {
  /* 회원정보 */
  photo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD_XhYdmR6qXF3-vwbIM2chfgViThiOqRAWTxqAtrRCYw6jLOMxyjLAQ4J6uBHv36npuA6PDU8FO53p91K8SdtVc0E6_iC0fcaCfm1t-AWQlZ79mw0JbqwctByAgeKUXu1gGy-Dx6B9OxrSty_e6RKzmeFAs_di9m-D3Gh9yVSNKjJXQsQnI-ZT7rlc0tmu_0ZZ4ZreYjeoggeL6TZ9BDxlRgeAyNCKcvKAA9HguOBc4RqKww3pWO7Bzz7Jwr3j3pLtyMC1ZIUfcKc',
  name: '정한결',
  birthDate: '1996-03-14',
  age: 29,
  address: '서울특별시 강남구 역삼동 123-45',
  gender: '남성',
  phone: '010-1234-5678',
  email: 'hangyeol@example.com',

  /* 학력 */
  education: {
    school: '한국대학교',
    major: '경영학과',
    degree: '학사 졸업',
    period: '2015.03 ~ 2021.02',
  },

  /* 경력 */
  careers: [
    {
      company: '(주)쿠팡로지스틱스',
      role: '배송 드라이버',
      period: '2022.06 ~ 2026.04',
      desc: '강남·서초 권역 담당 배송 드라이버. 일 평균 80건 처리.',
    },
    {
      company: '맘스터치 역삼점',
      role: '홀 매니저',
      period: '2021.03 ~ 2022.05',
      desc: '홀 운영 총괄, 신규 직원 교육 담당.',
    },
  ],

  /* 자격증 */
  certificates: [
    { name: '1종 보통 운전면허', issuer: '경찰청', date: '2016.08' },
    { name: '지게차 운전기능사', issuer: '한국산업인력공단', date: '2022.03' },
    { name: '보건증', issuer: '강남구보건소', date: '2025.11' },
  ],

  /* 희망근무지 */
  preferredLocations: ['서울시 강남구 역삼동', '서울시 서초구 반포동'],

  /* 희망업직종 */
  preferredJobs: ['배달 · 물류 · 운전', '편의점 · 마트', '창고 · 물류 관리'],

  /* 리뷰 */
  reviews: {
    avgRating: 4.7,
    totalCount: 32,
    topLabels: [
      { label: '#시간약속 철저', count: 24 },
      { label: '#성실한 업무태도', count: 19 },
    ],
    all: [
      {
        reviewer: '(주)쿠팡로지스틱스',
        rating: 5.0,
        date: '2026.03.28',
        text: '항상 제시간에 출근하고 업무 처리가 깔끔했습니다. 다시 함께 일하고 싶은 인재입니다.',
      },
      {
        reviewer: '맘스터치 역삼점',
        rating: 4.5,
        date: '2025.11.12',
        text: '고객 응대가 친절하고 책임감이 강합니다. 팀원들과의 협력도 좋았습니다.',
      },
      {
        reviewer: 'CU 서초중앙점',
        rating: 4.5,
        date: '2025.07.03',
        text: '빠른 습득력으로 바로 현장에 투입되었습니다. 적극적인 자세가 인상적이었습니다.',
      },
      {
        reviewer: 'GS25 강남역점',
        rating: 4.8,
        date: '2025.05.20',
        text: '업무 인수인계가 빠르고 정확해서 매장 운영에 큰 도움이 되었습니다.',
      },
      {
        reviewer: '이마트24 선릉점',
        rating: 4.6,
        date: '2025.02.17',
        text: '피크타임 응대가 안정적이었고 동료와의 커뮤니케이션이 원활했습니다.',
      },
      {
        reviewer: '배민커넥트',
        rating: 4.9,
        date: '2024.12.08',
        text: '배차 수락률과 완료율이 높아 신뢰할 수 있는 크루였습니다.',
      },
    ],
    recent: [
      {
        reviewer: '(주)쿠팡로지스틱스',
        rating: 5.0,
        date: '2026.03.28',
        text: '항상 제시간에 출근하고 업무 처리가 깔끔했습니다. 다시 함께 일하고 싶은 인재입니다.',
      },
      {
        reviewer: '맘스터치 역삼점',
        rating: 4.5,
        date: '2025.11.12',
        text: '고객 응대가 친절하고 책임감이 강합니다. 팀원들과의 협력도 좋았습니다.',
      },
      {
        reviewer: 'CU 서초중앙점',
        rating: 4.5,
        date: '2025.07.03',
        text: '빠른 습득력으로 바로 현장에 투입되었습니다. 적극적인 자세가 인상적이었습니다.',
      },
    ],
  },
};

/* ──────────────────────────────────────────
   별점 렌더링 헬퍼
────────────────────────────────────────── */
function StarRating({ rating, size = 'text-base' }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className={`flex items-center gap-0.5 text-primary ${size}`}>
      {Array(full)
        .fill(0)
        .map((_, i) => (
          <span key={`f${i}`} className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
            star
          </span>
        ))}
      {half && (
        <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
          star_half
        </span>
      )}
      {Array(empty)
        .fill(0)
        .map((_, i) => (
          <span key={`e${i}`} className="material-symbols-outlined">
            star
          </span>
        ))}
    </span>
  );
}

/* ──────────────────────────────────────────
   섹션 헤더 공통 컴포넌트
────────────────────────────────────────── */
function SectionTitle({ icon, children }) {
  return (
    <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-5">
      <span className="material-symbols-outlined text-sm">{icon}</span>
      {children}
    </h2>
  );
}

/* ──────────────────────────────────────────
   메인 페이지
────────────────────────────────────────── */
export default function TalentProfilePage() {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const d = talentData;

  return (
    <>
      <TopNavBar />

      <main className="max-w-4xl mx-auto px-6 py-12 pt-32 pb-40">
        {/* ── 뒤로가기 ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary font-bold text-sm mb-8 hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          인재 목록으로
        </button>

        {/* ══════════════════════════════════
            1. 회원정보 헤더
        ══════════════════════════════════ */}
        <section className="bg-white rounded-2xl border border-outline p-8 mb-8 flex flex-col md:flex-row md:items-start gap-8">
          {/* 프로필 사진 */}
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-surface-container-low border border-outline shrink-0">
            <img src={d.photo} alt={d.name} className="w-full h-full object-cover" />
          </div>

          {/* 이름 + 기본 정보 */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{d.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-primary text-sm font-bold">
                <StarRating rating={d.reviews.avgRating} size="text-sm" />
                <span>{d.reviews.avgRating}</span>
                <span className="text-on-surface-variant font-medium">({d.reviews.totalCount}개 리뷰)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <InfoRow icon="cake" label="생년월일">{d.birthDate} ({d.age}세)</InfoRow>
              <InfoRow icon="wc" label="성별">{d.gender}</InfoRow>
              <InfoRow icon="location_on" label="주소">{d.address}</InfoRow>
              <InfoRow icon="call" label="전화번호">{d.phone}</InfoRow>
              <InfoRow icon="mail" label="이메일" className="sm:col-span-2">{d.email}</InfoRow>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {/* ══════════════════════════════════
              2. 학력
          ══════════════════════════════════ */}
          <Card>
            <SectionTitle icon="school">학력 (최종)</SectionTitle>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-base">school</span>
              </div>
              <div>
                <p className="font-bold text-on-surface">{d.education.school}</p>
                <p className="text-sm text-on-surface-variant font-medium">
                  {d.education.major} · {d.education.degree}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">{d.education.period}</p>
              </div>
            </div>
          </Card>

          {/* ══════════════════════════════════
              3. 경력
          ══════════════════════════════════ */}
          <Card>
            <SectionTitle icon="work">경력</SectionTitle>
            <div className="space-y-5">
              {d.careers.map((c, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-base">business_center</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-on-surface">{c.company}</span>
                      <span className="bg-primary-soft text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {c.role}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5 mb-1">{c.period}</p>
                    <p className="text-sm text-on-surface-variant">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ══════════════════════════════════
              4. 자격증
          ══════════════════════════════════ */}
          <Card>
            <SectionTitle icon="verified">자격증</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {d.certificates.map((cert, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl border border-outline"
                >
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>
                    badge
                  </span>
                  <div>
                    <p className="font-bold text-on-surface text-sm">{cert.name}</p>
                    <p className="text-xs text-on-surface-variant">{cert.issuer}</p>
                    <p className="text-xs text-on-surface-variant">{cert.date} 취득</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ══════════════════════════════════
              5. 희망근무지 & 희망업직종
          ══════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 희망근무지 */}
            <Card>
              <SectionTitle icon="location_on">희망근무지</SectionTitle>
              <div className="space-y-2">
                {d.preferredLocations.map((loc, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-on-surface">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                    {loc}
                  </div>
                ))}
              </div>
            </Card>

            {/* 희망업직종 */}
            <Card>
              <SectionTitle icon="category">희망업직종</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {d.preferredJobs.map((job, i) => (
                  <span
                    key={i}
                    className="bg-primary-soft text-primary font-bold text-xs px-3 py-1.5 rounded-full border border-primary/20"
                  >
                    {job}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* ══════════════════════════════════
              6. 리뷰
          ══════════════════════════════════ */}
          <Card>
            <SectionTitle icon="reviews">리뷰</SectionTitle>

            <div className="flex justify-end -mt-2 mb-4">
              <button
                onClick={() => setShowAllReviewsModal(true)}
                className="text-xs font-bold text-primary hover:underline underline-offset-2 transition-all"
              >
                리뷰 전체 보기
              </button>
            </div>

            {/* 별점 요약 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black text-on-surface">{d.reviews.avgRating}</span>
                <div>
                  <StarRating rating={d.reviews.avgRating} size="text-xl" />
                  <p className="text-xs text-on-surface-variant mt-1">총 {d.reviews.totalCount}개의 평가</p>
                </div>
              </div>

              {/* 상위 라벨 */}
              <div className="flex flex-wrap gap-2">
                {d.reviews.topLabels.map((lbl, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-surface-container-low border border-outline rounded-full px-4 py-2"
                  >
                    <span className="text-xs font-bold text-on-surface">{lbl.label}</span>
                    <span className="text-[10px] font-black text-primary bg-primary-soft rounded-full px-1.5 py-0.5">
                      {lbl.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 구분선 */}
            <div className="h-px bg-outline/30 mb-6"></div>

            {/* 최근 리뷰 3개 */}
            <div className="space-y-4">
              {d.reviews.all.slice(0, 3).map((rv, i) => (
                <div key={i} className="p-5 bg-surface-container-low rounded-xl border border-outline">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
                          storefront
                        </span>
                      </div>
                      <span className="font-bold text-sm text-on-surface">{rv.reviewer}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <StarRating rating={rv.rating} size="text-sm" />
                      <span className="text-xs font-bold text-primary ml-1">{rv.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface leading-relaxed">{rv.text}</p>
                  <p className="text-xs text-on-surface-variant mt-2 text-right">{rv.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {/* ── 하단 고정 액션 바 ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-outline px-6 py-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors shrink-0">
            <span className="material-symbols-outlined text-2xl">bookmark</span>
            <span className="text-[10px] font-bold">스크랩</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors shrink-0">
            <span className="material-symbols-outlined text-2xl">share</span>
            <span className="text-[10px] font-bold">공유</span>
          </button>
          <div className="h-10 w-px bg-outline/30 mx-2 hidden md:block"></div>
          <div className="flex-1 flex gap-3">
            <CommonButton
              variant="subtle"
              size="full"
              className="flex-1 rounded-xl"
              onClick={() => setShowContactModal(true)}
            >
              메시지 보내기
            </CommonButton>
            <CommonButton
              className="flex-[2] rounded-xl"
              onClick={() => setShowContactModal(true)}
            >
              제의하기
            </CommonButton>
          </div>
        </div>
      </div>

      {/* ── 전체 리뷰 모달 ── */}
      <div
        className={`${showAllReviewsModal ? '' : 'hidden'} fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6`}
      >
        <div
          className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          onClick={() => setShowAllReviewsModal(false)}
        ></div>

        <div className="relative bg-white w-full max-w-3xl rounded-2xl border border-outline shadow-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-outline flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-on-surface">전체 리뷰</h3>
              <p className="text-xs text-on-surface-variant mt-1">총 {d.reviews.totalCount}개 중 표시 가능한 리뷰</p>
            </div>
            <button
              onClick={() => setShowAllReviewsModal(false)}
              className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-variant transition-colors"
              aria-label="전체 리뷰 모달 닫기"
            >
              <span className="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>

          <div className="max-h-[65vh] overflow-y-auto p-6 space-y-4 bg-surface-container-low/40">
            {d.reviews.all.map((rv, i) => (
              <div key={`all-${i}`} className="p-5 bg-white rounded-xl border border-outline">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
                        storefront
                      </span>
                    </div>
                    <span className="font-bold text-sm text-on-surface">{rv.reviewer}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <StarRating rating={rv.rating} size="text-sm" />
                    <span className="text-xs font-bold text-primary ml-1">{rv.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-on-surface leading-relaxed">{rv.text}</p>
                <p className="text-xs text-on-surface-variant mt-2 text-right">{rv.date}</p>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-outline bg-white flex justify-end">
            <CommonButton variant="subtle" onClick={() => setShowAllReviewsModal(false)}>
              닫기
            </CommonButton>
          </div>
        </div>
      </div>

      <AppFooter />

      {/* ── 로그인 모달 ── */}
      <div
        className={`${showContactModal ? '' : 'hidden'} fixed inset-0 z-[100] flex items-center justify-center p-6`}
      >
        <div
          className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          onClick={() => setShowContactModal(false)}
        ></div>
        <div className="relative bg-white w-full max-w-md p-10 rounded-2xl flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mb-6">
            <span
              className="material-symbols-outlined text-primary text-4xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              lock
            </span>
          </div>
          <h5 className="text-2xl font-bold mb-3">기업회원 전용 메뉴입니다</h5>
          <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
            인재 제의 및 메시지 발송은<br />기업회원 로그인 후 이용하실 수 있습니다.
          </p>
          <div className="w-full flex flex-col gap-3">
            <CommonButton size="full" onClick={() => setShowContactModal(false)}>
              기업회원 로그인
            </CommonButton>
            <CommonButton variant="subtle" size="full" onClick={() => setShowContactModal(false)}>
              기업회원 가입하기
            </CommonButton>
          </div>
          <button
            className="mt-6 text-on-surface-variant text-sm font-bold underline decoration-outline underline-offset-4"
            onClick={() => setShowContactModal(false)}
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────
   로컬 헬퍼 컴포넌트
────────────────────────────────────────── */
function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-outline p-7">{children}</div>
  );
}

function InfoRow({ icon, label, children, className = '' }) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <span className="material-symbols-outlined text-base text-on-surface-variant mt-0.5">{icon}</span>
      <div>
        <span className="text-xs text-on-surface-variant block">{label}</span>
        <span className="font-semibold text-on-surface text-sm">{children}</span>
      </div>
    </div>
  );
}

