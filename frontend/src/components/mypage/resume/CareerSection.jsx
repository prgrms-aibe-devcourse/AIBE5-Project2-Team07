import React, { useState } from 'react';
import BrandPickerModal from './BrandPickerModal';
import { getBrandById, getBusinessTypeLabel } from '../../../utils/mypageUtils';

export default function CareerSection({ careers, setCareers }) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [activeCareerIndex, setActiveCareerIndex] = useState(null);

    const handleChange = (index, field, value) => {
        const copied = [...careers];
        copied[index] = {
            ...copied[index],
            [field]: value,
        };
        setCareers(copied);
    };

    const handleCareerTypeChange = (index, careerType) => {
        const copied = [...careers];
        const current = copied[index];

        if (careerType === 'BRAND') {
            copied[index] = {
                ...current,
                careerType: 'BRAND',
                businessType: current.businessType || '',
            };
        } else {
            copied[index] = {
                ...current,
                careerType: 'MANUAL',
                brandId: null,
                businessType: '',
            };
        }

        setCareers(copied);
    };

    const openBrandPicker = (index) => {
        setActiveCareerIndex(index);
        setPickerOpen(true);
    };

    const handleBrandSelect = (brand) => {
        if (activeCareerIndex === null) return;

        const copied = [...careers];
        copied[activeCareerIndex] = {
            ...copied[activeCareerIndex],
            careerType: 'BRAND',
            brandId: brand.id,
            businessType: brand.businessType,
            company: brand.name,
            _deleted: false,
        };
        setCareers(copied);
        setPickerOpen(false);
        setActiveCareerIndex(null);
    };

    const clearBrand = (index) => {
        const copied = [...careers];
        copied[index] = {
            ...copied[index],
            brandId: null,
            businessType: '',
            company: '',
        };
        setCareers(copied);
    };

    const addCareer = () => {
        setCareers([
            ...careers,
            {
                id: null,
                company: '',
                role: '',
                startDate: '',
                endDate: '',
                brandId: null,
                businessType: '',
                careerType: 'MANUAL',
                _deleted: false,
            },
        ]);
    };

    const removeCareer = (index) => {
        const copied = [...careers];
        const target = copied[index];

        if (!target) return;

        if (target.id) {
            copied[index] = {
                ...target,
                _deleted: true,
            };
        } else {
            copied.splice(index, 1);
        }

        setCareers(copied);
    };

    return (
        <>
            <section className="bg-white p-8 rounded-2xl border border-[#EAE5E3] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-extrabold text-[#1F1D1D]">경력 사항</h2>
                </div>

                <div className="space-y-4">
                    {careers.map((career, index) => {
                        if (career._deleted) return null;

                        const selectedBrand = career.brandId ? getBrandById(career.brandId) : null;
                        const isBrandCareer = career.careerType === 'BRAND';

                        return (
                            <div
                                key={career.id || `career-${index}`}
                                className="bg-gray-50/50 p-5 rounded-xl border border-[#EAE5E3]/60 space-y-4"
                            >
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleCareerTypeChange(index, 'MANUAL')}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                                            !isBrandCareer
                                                ? 'bg-[#FFF0F3] border-primary text-primary'
                                                : 'bg-white border-[#EAE5E3] text-[#6B6766]'
                                        }`}
                                    >
                                        직접 입력 경력
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCareerTypeChange(index, 'BRAND')}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                                            isBrandCareer
                                                ? 'bg-[#FFF0F3] border-primary text-primary'
                                                : 'bg-white border-[#EAE5E3] text-[#6B6766]'
                                        }`}
                                    >
                                        브랜드 경력
                                    </button>
                                </div>

                                {isBrandCareer && (
                                    <div className="bg-white border border-[#EAE5E3] rounded-xl p-4 space-y-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <div className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider">
                                                    선택한 브랜드
                                                </div>
                                                <div className="mt-1 text-sm font-bold text-[#1F1D1D]">
                                                    {selectedBrand ? selectedBrand.name : '선택되지 않음'}
                                                </div>
                                                <div className="mt-1 text-xs text-[#6B6766]">
                                                    {selectedBrand ? getBusinessTypeLabel(selectedBrand.businessType) : '브랜드를 선택해주세요.'}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openBrandPicker(index)}
                                                    className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold"
                                                >
                                                    브랜드 선택
                                                </button>
                                                {selectedBrand && (
                                                    <button
                                                        type="button"
                                                        onClick={() => clearBrand(index)}
                                                        className="px-4 py-2 bg-gray-100 text-[#1F1D1D] rounded-lg text-xs font-bold"
                                                    >
                                                        선택 해제
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div>
                                        <label className="text-[13px] font-bold text-[#6B6766] block mb-1.5">근무처</label>
                                        <input
                                            type="text"
                                            value={career.company || ''}
                                            onChange={(e) => handleChange(index, 'company', e.target.value)}
                                            placeholder={isBrandCareer ? '브랜드 선택 시 자동 입력' : '회사명 또는 가게명'}
                                            disabled={isBrandCareer}
                                            className={`w-full border rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none ${
                                                isBrandCareer
                                                    ? 'bg-gray-100 border-[#EAE5E3] text-[#6B6766]'
                                                    : 'bg-white border-[#EAE5E3] focus:border-primary/50'
                                            }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[13px] font-bold text-[#6B6766] block mb-1.5">직무</label>
                                        <input
                                            type="text"
                                            value={career.role || ''}
                                            onChange={(e) => handleChange(index, 'role', e.target.value)}
                                            placeholder="예: 홀서빙"
                                            className="w-full bg-white border border-[#EAE5E3] rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-primary/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[13px] font-bold text-[#6B6766] block mb-1.5">시작일</label>
                                        <input
                                            type="date"
                                            value={career.startDate || ''}
                                            onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                                            className="w-full bg-white border border-[#EAE5E3] rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-primary/50"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="text-[13px] font-bold text-[#6B6766] block mb-1.5">종료일</label>
                                            <input
                                                type="date"
                                                value={career.endDate || ''}
                                                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                                                className="w-full bg-white border border-[#EAE5E3] rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-primary/50"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeCareer(index)}
                                            className="w-10 h-10 self-end flex items-center justify-center rounded-lg border border-[#EAE5E3] text-[#6B6766] hover:text-primary hover:border-primary/30 transition-colors bg-white"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        type="button"
                        onClick={addCareer}
                        className="w-full border-2 border-dashed border-[#EAE5E3]/60 py-5 rounded-2xl flex flex-col items-center justify-center gap-1 text-[#6B6766] hover:bg-[#FFF0F3]/10 hover:border-primary/30 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-full border border-[#EAE5E3] flex items-center justify-center mb-1 group-hover:border-primary/30 group-hover:bg-white">
                            <span className="material-symbols-outlined text-xl group-hover:text-primary">add</span>
                        </div>
                        <span className="text-xs font-bold">경력 추가하기</span>
                    </button>
                </div>
            </section>

            <BrandPickerModal
                open={pickerOpen}
                onClose={() => {
                    setPickerOpen(false);
                    setActiveCareerIndex(null);
                }}
                onSelect={handleBrandSelect}
                initialBusinessType={activeCareerIndex !== null ? careers[activeCareerIndex]?.businessType || '' : ''}
            />
        </>
    );
}