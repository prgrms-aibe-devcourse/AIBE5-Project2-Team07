import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

export default function CompanyDetailPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <TopNavBar />
      <main className="pb-32 pt-20">

        {/* Section 1: Employer Identity */}
        <section className="py-24 bg-white">
          <div className="custom-container">
            <div className="flex flex-col lg:flex-row items-start gap-12">
              {/* Logo */}
              <div className="w-32 h-32 rounded-xl bg-[#F8F9FA] border border-outline flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  alt="CU Logo"
                  className="w-20 h-auto"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHmZfWf_8q99t4E7W7Pz7Xy0-wZ5-J4n0K5L-N_O8lR6U5N0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              {/* Company Info */}
              <div className="max-w-4xl">
                <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">
                  Verified Employer
                </span>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
                  CU 서초중앙점
                </h1>
                <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">설립일</span>
                    <span className="text-base font-semibold text-on-surface">2018년 10월 24일</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">전화번호</span>
                    <span className="text-base font-semibold text-on-surface">02-1234-5678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">홈페이지</span>
                    <a
                      className="text-base font-semibold text-primary hover:underline transition-all"
                      href="http://www.bgfretail.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      www.bgfretail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Location */}
        <section className="py-20 border-y border-outline bg-[#F8F9FA]">
          <div className="custom-container">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              {/* Map */}
              <div className="w-full lg:w-3/5 aspect-[16/9] bg-outline overflow-hidden rounded-xl border border-outline relative">
                <img
                  className="w-full h-full object-cover"
                  alt="map location"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWfqHvpyvWqF5UJ4001KlN67pQM007ECBKkQYn48K--58Vm9LbpQOxTp7xxdhkyzmfbG9_FHARWN87pl9Ahq3nwGea1k-T9Raf2SkVrmf3cBQv5ZJgSH1w3-1cnuwNPjNNtRnPWOkACBVgwwzT3evE91bFh9pKNDerpCg_Jfk3_QpSaLYZep2rMVMGl5XHX5IAtOX5vmTD9eRCtYobFNkO_JX-0UvN2M4dlmLYSUqS3CJo7GHyHYdWK_6VPmzykPANOwclPR8pVLo"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-xl flex items-center gap-3 border border-primary">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <span className="font-bold text-sm text-on-surface">CU 서초중앙점</span>
                  </div>
                </div>
              </div>
              {/* Address Info */}
              <div className="w-full lg:w-2/5">
                <h2 className="text-3xl font-black mb-6 tracking-tight">근무지 위치</h2>
                <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
                  서울특별시 서초구 서초대로 320<br />
                  (서초동, 하이엔드빌딩 1층)
                </p>
                <div className="flex gap-4">
                  <CommonButton
                    variant="outline"
                    icon={<span className="material-symbols-outlined text-primary text-xl">map</span>}
                  >
                    네이버 지도
                  </CommonButton>
                  <CommonButton
                    variant="outline"
                    icon={<span className="material-symbols-outlined text-primary text-xl">navigation</span>}
                  >
                    카카오 맵
                  </CommonButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Network Voice (Reviews) */}
        <section className="py-24 bg-white">
          <div className="custom-container">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Network Voice</h2>
                <div className="flex items-center gap-3">
                  <div className="flex text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  </div>
                  <span className="text-2xl font-black">
                    4.9{' '}
                    <span className="text-on-surface-variant text-lg font-medium">/ 5.0</span>
                  </span>
                </div>
              </div>
              <CommonButton
                variant="outline"
                className="bg-[#F8F9FA]"
                icon={<span className="material-symbols-outlined">add</span>}
              >
                리뷰 더보기
              </CommonButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Review Card 1 */}
              <div className="p-8 border border-outline rounded-xl hover:border-primary transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-outline bg-[#F8F9FA]">
                    <img
                      className="w-full h-full object-cover"
                      alt="reviewer"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZRhdlLd2hEF5qrZKmxKDjGzdOHJr6KZM5xhtH9--jKNziDQFgHzCQb1bk4pc4hpcRZI0ll2R52BOT-lz4RVn_LiciY8z1i-8hQHcgWLe0wYXxfTdh_7ldT20fX4y1a5eMbIvDcFHJs9zoQaFY5z58ot26IY_sf_rxc6x8ZvnMLvSfdiiUlOV_F2mrGLsPcoqdGFe1_IiHr3lwKbNvPIUIN9LoH7meHOKyIkD8N45E8EEs6BxiZTkQrK2f4MObq7TWr2tM9g7DvGk"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg">최서윤</p>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      평일 야간 대타 (3회 근무)
                    </p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-on-surface">
                  "점장님이 정말 친절하시고 인수인계가 확실해서 편했어요. 위치가 좋아서 퇴근길에도 위험하지 않아 좋았습니다."
                </p>
              </div>
              {/* Review Card 2 */}
              <div className="p-8 border border-outline rounded-xl hover:border-primary transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-outline bg-[#F8F9FA]">
                    <img
                      className="w-full h-full object-cover"
                      alt="reviewer"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBivH1qiy33m1kNVmsITABBDC446bMHwPOBJALJub5JoInhHxjRZeFmDzOLcS0mn-pVBb4Ht2bqJ80BgSe1g30b71KEMGc-Ck2K7oA91scymIAGbcFrNCpVtHGNCy8IOXa3yQw09jV-smZYl7zl4mspZUhcTrXyaI-KbpLqnPMaky_gEsDtUQ_larn7jVOmiT0CjCLVk0BwrQU-bK7y-n_F7FEuaEyzypS6sOKoyZJjOPEKpKAYnez-P1RvfeQtcl7zJm1HV8PAG84"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg">박준형</p>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      주말 오전 대타 (1회 근무)
                    </p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-on-surface">
                  "매장이 깨끗하게 관리되어 있어서 일하기 좋았습니다. 급여 지급도 당일에 바로 처리해주셔서 최고예요!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Active Missions */}
        <section className="py-24 bg-[#F8F9FA]">
          <div className="custom-container">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">Active Missions</h2>
                <p className="text-on-surface-variant font-medium">
                  CU 서초중앙점에서 현재 모집 중인 공고입니다.
                </p>
              </div>
              <Link
                to="/recruit-information"
                className="text-primary font-bold flex items-center gap-1 group py-2 hover:underline underline-offset-2"
              >
                전체 공고 보기
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Job Card 1 – Emergency */}
              <Link
                to="/recruit-detail"
                className="bg-white border border-outline p-8 rounded-xl flex flex-col justify-between min-h-[280px] hover:border-primary transition-all shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-primary text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                      Emergency
                    </span>
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      emergency
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight">오늘 야간 편의점 긴급 대타</h3>
                  <p className="text-sm text-on-surface-variant">22:00 ~ 06:00 (8시간)</p>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-outline mt-auto">
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Payout</p>
                    <p className="text-xl font-black text-primary">₩120,000 / Shift</p>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant">10분 전 등록</span>
                </div>
              </Link>
              {/* Job Card 2 – Scheduled */}
              <Link
                to="/recruit-detail"
                className="bg-white border border-outline p-8 rounded-xl flex flex-col justify-between min-h-[280px] hover:border-primary transition-all shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-[#F8F9FA] text-on-surface-variant border border-outline px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                      Scheduled
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant">event</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight">이번주 토요일 오전 파트너</h3>
                  <p className="text-sm text-on-surface-variant">08:00 ~ 14:00 (6시간)</p>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-outline mt-auto">
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Payout</p>
                    <p className="text-xl font-black text-on-surface">₩75,000 / Shift</p>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant">2시간 전 등록</span>
                </div>
              </Link>
              {/* Job Card 3 – Scheduled */}
              <Link
                to="/recruit-detail"
                className="bg-white border border-outline p-8 rounded-xl flex flex-col justify-between min-h-[280px] hover:border-primary transition-all shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-[#F8F9FA] text-on-surface-variant border border-outline px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                      Scheduled
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant">event</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight">다음주 월요일 미들 타임</h3>
                  <p className="text-sm text-on-surface-variant">14:00 ~ 20:00 (6시간)</p>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-outline mt-auto">
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Payout</p>
                    <p className="text-xl font-black text-on-surface">₩70,000 / Shift</p>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant">어제 등록</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </>
  );
}

