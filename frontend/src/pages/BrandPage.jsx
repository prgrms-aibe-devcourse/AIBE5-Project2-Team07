import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import BrandModal from '../components/BrandModal';

// urgent brands will be fetched from backend

// all brands will be fetched from backend as random 8 brands

export default function BrandPage() {
  const navigate = useNavigate();

  const getBrandLogoUrl = (brand) => {
    const rawLogo = brand?.logoImagePath
      || brand?.logo_image_path
      || brand?.logoImg
      || brand?.logo_img
      || brand?.logoUrl
      || brand?.logo_url
      || brand?.brandLogo
      || brand?.logo
      || '';

    if (!rawLogo || typeof rawLogo !== 'string') return '';
    const trimmed = rawLogo.trim();
    if (!trimmed) return '';

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed;
    }

    return `/${trimmed}`;
  };

  const getUrgentBannerUrl = (brand) => {
    const rawBanner = brand?.banner_img || brand?.bannerImg || '';

    if (!rawBanner || typeof rawBanner !== 'string') return '';
    const trimmed = rawBanner.trim();
    if (!trimmed) return '';

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed;
    }

    return `/${trimmed}`;
  };

  // urgent brands fetched from backend
  const [urgentBrands, setUrgentBrands] = useState([]);
  const [urgentLoading, setUrgentLoading] = useState(false);
  // random brands for "전체 브랜드 탐색"
  const [randomBrands, setRandomBrands] = useState([]);

  const fetchUrgentBrands = () => {
    setUrgentLoading(true);
    let mounted = true;
    fetch('/api/brand/urgent')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) setUrgentBrands(data);
        else setUrgentBrands([]);
      })
      .catch((err) => {
        console.error('failed to fetch urgent brands', err);
        if (mounted) setUrgentBrands([]);
      })
      .finally(() => {
        if (mounted) setUrgentLoading(false);
      });
    return () => { mounted = false; };
  };

  useEffect(() => {
    const cleanupU = fetchUrgentBrands();
    // fetch random brands
    const fetchRandomBrands = () => {
      let mounted = true;
      fetch('/api/brand/random')
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then((data) => {
          if (!mounted) return;
          if (Array.isArray(data)) setRandomBrands(data);
          else setRandomBrands([]);
        })
        .catch((err) => {
          console.error('failed to fetch random brands', err);
          if (mounted) setRandomBrands([]);
        })
        .finally(() => {
          /* nothing to do */
        });
      return () => { mounted = false; };
    };
    const cleanupR = fetchRandomBrands();
    return () => { if (typeof cleanupU === 'function') cleanupU(); if (typeof cleanupR === 'function') cleanupR(); };
  }, []);

  // Autocomplete state
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // modal for "전체 브랜드 보기"
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!q || !q.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const handle = setTimeout(() => {
      setLoading(true);
      fetch(`/api/brand/search/autocomplete?q=${encodeURIComponent(q.trim())}`)
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then((data) => {
          setSuggestions(Array.isArray(data) ? data : []);
          setShowSuggestions(true);
        })
        .catch((err) => {
          console.error('autocomplete fetch error', err);
          setSuggestions([]);
          setShowSuggestions(false);
        })
        .finally(() => setLoading(false));
    }, 350); // debounce 350ms

    return () => clearTimeout(handle);
  }, [q]);

  // modal data fetch/selection logic is handled inside BrandModal component.

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
              <div className="relative">
                <input
                  className="w-full bg-[#f9f9f9] border-none focus:ring-2 focus:ring-primary/20 rounded-2xl py-6 pl-16 pr-28 text-xl font-medium transition-all placeholder:text-on-surface-variant/50 shadow-sm"
                  placeholder="브랜드 검색 (예: 스타벅스, 쿠팡)"
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
                />

                {/* suggestions dropdown */}
                {showSuggestions && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-56 overflow-auto">
                    {loading ? (
                      <div className="p-3 text-sm text-center">로딩 중...</div>
                    ) : suggestions.length ? (
                      <ul>
                        {suggestions.map((s) => (
                          <li
                            key={s.id}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                            onMouseDown={() => {
                              // onMouseDown to prevent input blur before click
                              setQ(s.name);
                              setShowSuggestions(false);
                              // Navigate to the brand's recruits page using query param brandId
                              navigate(`/brand/recruits?brandId=${encodeURIComponent(s.id)}`);
                            }}
                          >
                            <span className="text-sm">{s.name}</span>
                            <span className="text-xs font-semibold text-primary">바로가기</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-3 text-sm text-center text-on-surface-variant">검색 결과가 없습니다.</div>
                    )}
                  </div>
                )}
              </div>
              {/* 검색 버튼 제거: 우측의 분홍색 '검색' 버튼은 현재 필요없어 삭제함 */}
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
              <button
                className="flex items-center gap-1 text-primary font-bold hover:underline underline-offset-4 transition-all"
                onClick={() => fetchUrgentBrands()}
                disabled={urgentLoading}
              >
                {urgentLoading ? (
                  <>
                    갱신 중... <span className="material-symbols-outlined">autorenew</span>
                  </>
                ) : (
                  <>
                    실시간 업데이트 <span className="material-symbols-outlined">trending_up</span>
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {urgentBrands.map((b) => {
                const name = b.name || b.brand_name || b.brandName || '브랜드';
                const cnt = b.urgentCount ?? b.urgent_count ?? b.count ?? 0;
                const id = b.id ?? b.brandId ?? b.brand_id ?? '';
                const bannerUrl = getUrgentBannerUrl(b);
                return (
                  <div
                    key={name + '_' + id}
                    role="button"
                    tabIndex={0}
                    onClick={() => { if (id) navigate(`/brand/recruits?brandId=${encodeURIComponent(id)}`); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && id) navigate(`/brand/recruits?brandId=${encodeURIComponent(id)}`); }}
                    className="group bg-white rounded-2xl overflow-hidden transition-all shadow-md hover:shadow-xl hover:-translate-y-1 border border-outline/30 cursor-pointer"
                  >
                    <div className="h-48 overflow-hidden bg-primary-soft relative flex items-center justify-center">
                      {bannerUrl ? (
                        <img
                          src={bannerUrl}
                          alt={`${name} 배너`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-primary flex items-center shadow-sm">
                        <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: '"FILL" 1' }}>
                          emergency
                        </span>
                        <span className="text-xs font-bold">급구</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{name}</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-5 border-t border-outline/50">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary text-white text-xs font-black shadow-sm">
                          {cnt}건 공고 진행중
                        </span>
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f9f9f9]">
          <div className="custom-container">
            <div className="mb-12">
              <h2 className="text-3xl font-extrabold tracking-tighter mb-2">전체 브랜드 탐색</h2>
              <p className="text-on-surface-variant font-medium">43개의 프리미엄 파트너사를 확인해보세요.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {randomBrands.map((b) => {
                const name = b.name || b.brand_name || b.brandName || '브랜드';
                const id = b.id ?? b.brandId ?? b.brand_id ?? '';
                const logoUrl = getBrandLogoUrl(b);
                return (
                  <div
                    key={name + '_' + id}
                    role="button"
                    tabIndex={0}
                    onClick={() => { if (id) navigate(`/brand/recruits?brandId=${encodeURIComponent(id)}`); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && id) navigate(`/brand/recruits?brandId=${encodeURIComponent(id)}`); }}
                    className="bg-white p-6 rounded-xl flex items-center justify-between hover:shadow-md transition-all border border-outline/30 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f9f9f9] rounded-full flex items-center justify-center border border-outline/50 overflow-hidden">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={`${name} 로고`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">image</span>
                        )}
                      </div>
                      <div>
                        <span className="font-bold block text-sm">{name}</span>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{''}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-16 flex justify-center">
              <CommonButton
                variant="outline"
                size="xl"
                onClick={() => setIsModalOpen(true)}
                icon={<span className="material-symbols-outlined text-lg">add</span>}
              >
                전체 브랜드 보기
              </CommonButton>
            </div>

            <BrandModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

          </div>
        </section>
      </main>

      <AppFooter />

      <MobileBottomNav />
    </>
  );
}
