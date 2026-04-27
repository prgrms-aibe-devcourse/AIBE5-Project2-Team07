import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function RegionSection({
                                          value = [],
                                          onChange,
                                          maxCount = 5,
                                      }) {
    const [regionOptions, setRegionOptions] = useState([]);
    const [selectedSido, setSelectedSido] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRegions();
    }, []);

    async function loadRegions() {
        try {
            setLoading(true);
            setError('');

            const res = await fetch(`${API_BASE}/api/regions`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error(`지역 목록 조회 실패: ${res.status}`);
            }

            const data = await res.json();
            const regions = Array.isArray(data) ? data : [];
            setRegionOptions(regions);

            if (!selectedSido && regions.length > 0) {
                const firstSido = regions.find((r) => r?.sido)?.sido;
                if (firstSido) setSelectedSido(firstSido);
            }
        } catch (err) {
            console.error('loadRegions error:', err);
            setError('지역 목록을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    }

    const sidoOptions = useMemo(() => {
        return Array.from(new Set(regionOptions.map((r) => r?.sido).filter(Boolean)));
    }, [regionOptions]);

    const sigunguOptions = useMemo(() => {
        if (!selectedSido) return [];
        return regionOptions.filter((r) => r?.sido === selectedSido);
    }, [regionOptions, selectedSido]);

    const selectedRegionLabels = useMemo(() => {
        return regionOptions
            .filter((region) => value.includes(Number(region.id)))
            .map((region) => ({
                id: Number(region.id),
                label: `${region.sido ?? ''} ${region.sigungu ?? ''}`.trim(),
            }));
    }, [regionOptions, value]);

    function toggleRegion(regionId) {
        const numericId = Number(regionId);

        if (value.includes(numericId)) {
            const next = value.filter((id) => id !== numericId);
            console.log('selected region ids =', next);
            onChange(next);
            return;
        }

        if (value.length >= maxCount) {
            alert(`선호지역은 최대 ${maxCount}개까지 선택할 수 있습니다.`);
            return;
        }

        const next = [...value, numericId];
        console.log('selected region ids =', next);
        onChange(next);
    }

    function removeRegion(regionId) {
        const next = value.filter((id) => id !== regionId);
        console.log('selected region ids =', next);
        onChange(next);
    }

    return (
        <section className="bg-white p-8 rounded-2xl border border-[#EAE5E3] shadow-sm space-y-6">
            <div>
                <label className="text-[15px] font-bold text-[#1F1D1D] uppercase tracking-wider block mb-2">
                    선호 지역
                </label>
                <p className="text-sm text-[#6B6766] font-medium">
                    근무를 희망하는 지역을 선택해주세요. 여러 개 선택할 수 있습니다.
                </p>
            </div>

            {loading ? (
                <div className="text-sm text-[#6B6766]">지역 목록 불러오는 중...</div>
            ) : (
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-[#EAE5E3] pb-3 md:pb-0 md:pr-4">
                        <div className="text-s font-semibold text-[#6B6766] mb-3">시/도</div>
                        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                            {sidoOptions.map((sido) => (
                                <button
                                    key={sido}
                                    type="button"
                                    onClick={() => setSelectedSido(sido)}
                                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedSido === sido
                                            ? 'bg-[#FFF0F3] text-primary'
                                            : 'bg-white text-[#6B6766] hover:bg-gray-50'
                                    }`}
                                >
                                    {sido}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="text-s font-semibold text-[#6B6766] mb-3">시/군/구</div>

                        {!selectedSido ? (
                            <div className="text-sm text-[#6B6766]">
                                왼쪽에서 시/도를 먼저 선택하세요.
                            </div>
                        ) : (
                            <div className="max-h-72 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-2">
                                {sigunguOptions.map((region) => {
                                    const regionId = Number(region.id);
                                    const checked = value.includes(regionId);

                                    return (
                                        <button
                                            key={regionId}
                                            type="button"
                                            onClick={() => toggleRegion(regionId)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-colors ${
                                                checked
                                                    ? 'bg-[#FFF0F3] text-primary border-primary/30'
                                                    : 'bg-white border-[#EAE5E3] text-[#6B6766] hover:bg-gray-50'
                                            }`}
                                        >
                                            {region.sigungu}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedRegionLabels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedRegionLabels.map((region) => (
                        <span
                            key={region.id}
                            className="bg-gray-50 border border-[#EAE5E3] text-[#6B6766] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2"
                        >
              <span>{region.label}</span>
              <button
                  type="button"
                  onClick={() => removeRegion(region.id)}
                  className="text-[11px] px-1 rounded-full hover:bg-gray-200"
              >
                ×
              </button>
            </span>
                    ))}
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}
        </section>
    );
}