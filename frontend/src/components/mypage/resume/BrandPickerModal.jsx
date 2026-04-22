import React, { useEffect, useState } from 'react';
import { BRAND_OPTIONS, BUSINESS_TYPE_OPTIONS } from '../../../constants/mypageConstants';
import { getBusinessTypeLabel } from '../../../utils/mypageUtils';

export default function BrandPickerModal({
                                             open,
                                             onClose,
                                             onSelect,
                                             initialBusinessType = '',
                                         }) {
    const [selectedType, setSelectedType] = useState(initialBusinessType);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        if (open) {
            setSelectedType(initialBusinessType || '');
            setKeyword('');
        }
    }, [open, initialBusinessType]);

    if (!open) return null;

    const filteredBrands = BRAND_OPTIONS.filter((brand) => {
        const matchType = selectedType ? brand.businessType === selectedType : true;
        const matchKeyword = keyword.trim()
            ? brand.name.toLowerCase().includes(keyword.trim().toLowerCase())
            : true;
        return matchType && matchKeyword;
    });

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

            <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-[#EAE5E3] shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-[#EAE5E3] flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-extrabold text-[#1F1D1D]">브랜드 경력 선택</h3>
                        <p className="text-xs text-[#6B6766] mt-1">
                            브랜드를 선택하면 회사명과 brandId가 함께 저장됩니다.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#6B6766]">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider block">
                            업종 필터
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedType('')}
                                className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                                    selectedType === ''
                                        ? 'bg-[#FFF0F3] border-primary text-primary'
                                        : 'bg-white border-[#EAE5E3] text-[#6B6766]'
                                }`}
                            >
                                전체
                            </button>

                            {BUSINESS_TYPE_OPTIONS.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setSelectedType(type.value)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                                        selectedType === type.value
                                            ? 'bg-[#FFF0F3] border-primary text-primary'
                                            : 'bg-white border-[#EAE5E3] text-[#6B6766]'
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="브랜드명 검색"
                            className="w-full bg-gray-50 border border-[#EAE5E3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="max-h-[420px] overflow-y-auto border border-[#EAE5E3] rounded-2xl">
                        {filteredBrands.length > 0 ? (
                            <div className="divide-y divide-[#EAE5E3]">
                                {filteredBrands.map((brand) => (
                                    <button
                                        key={brand.id}
                                        type="button"
                                        onClick={() => onSelect(brand)}
                                        className="w-full text-left px-5 py-4 hover:bg-[#FFF8FA] transition-colors flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-bold text-sm text-[#1F1D1D]">{brand.name}</div>
                                            <div className="text-xs text-[#6B6766] mt-1">
                                                {getBusinessTypeLabel(brand.businessType)}
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-primary">chevron_right</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center text-sm text-[#6B6766]">
                                조건에 맞는 브랜드가 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-[#EAE5E3] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-100 text-[#1F1D1D] rounded-xl font-bold text-sm"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}