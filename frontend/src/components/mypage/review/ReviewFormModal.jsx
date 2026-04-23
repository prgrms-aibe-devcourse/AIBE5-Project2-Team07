import React, { useEffect, useState } from 'react';
import { REVIEW_LABEL_OPTIONS_BY_TARGET } from '../../../constants/reviewConstants';

export default function ReviewFormModal({
                                            open,
                                            mode,
                                            initialValue,
                                            onClose,
                                            onSubmit,
                                            loading,
                                        }) {
    const [form, setForm] = useState(initialValue);

    useEffect(() => {
        setForm(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const allowed = REVIEW_LABEL_OPTIONS_BY_TARGET[form.targetType] || [];
        setForm((prev) => ({
            ...prev,
            labelNames: prev.labelNames.filter((label) => allowed.includes(label)),
        }));
    }, [form.targetType]);

    if (!open) return null;

    const availableLabels = REVIEW_LABEL_OPTIONS_BY_TARGET[form.targetType] || [];

    const toggleLabel = (label) => {
        setForm((prev) => ({
            ...prev,
            labelNames: prev.labelNames.includes(label)
                ? prev.labelNames.filter((item) => item !== label)
                : [...prev.labelNames, label],
        }));
    };

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#EAE5E3] shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-[#EAE5E3] flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-extrabold text-[#1F1D1D]">
                            {mode === 'create' ? '리뷰 작성' : '리뷰 수정'}
                        </h3>
                        <p className="text-xs text-[#6B6766] mt-1">별점, 내용, 라벨을 입력해주세요.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#6B6766]">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {mode === 'create' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider block mb-2">
                                    applyId
                                </label>
                                <input
                                    type="number"
                                    value={form.applyId}
                                    onChange={(e) => setForm((prev) => ({ ...prev, applyId: e.target.value }))}
                                    className="w-full bg-gray-50 border border-[#EAE5E3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider block mb-2">
                                    targetId
                                </label>
                                <input
                                    type="number"
                                    value={form.targetId}
                                    onChange={(e) => setForm((prev) => ({ ...prev, targetId: e.target.value }))}
                                    className="w-full bg-gray-50 border border-[#EAE5E3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider block mb-2">
                                    targetType
                                </label>
                                <select
                                    value={form.targetType}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            targetType: e.target.value,
                                        }))
                                    }
                                    className="w-full bg-gray-50 border border-[#EAE5E3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                >
                                    <option value="BUSINESS">BUSINESS</option>
                                    <option value="INDIVIDUAL">INDIVIDUAL</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {mode === 'edit' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 border border-[#EAE5E3] rounded-xl px-4 py-3">
                                <div className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider">applyId</div>
                                <div className="mt-1 text-sm font-semibold text-[#1F1D1D]">{form.applyId || '-'}</div>
                            </div>
                            <div className="bg-gray-50 border border-[#EAE5E3] rounded-xl px-4 py-3">
                                <div className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider">targetId</div>
                                <div className="mt-1 text-sm font-semibold text-[#1F1D1D]">{form.targetId || '-'}</div>
                            </div>
                            <div className="bg-gray-50 border border-[#EAE5E3] rounded-xl px-4 py-3">
                                <div className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider">targetType</div>
                                <div className="mt-1 text-sm font-semibold text-[#1F1D1D]">{form.targetType}</div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider block mb-2">
                            별점
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, rating: num }))}
                                    className="text-primary"
                                >
                  <span
                      className="material-symbols-outlined text-3xl"
                      style={num <= form.rating ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    star
                  </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider block mb-2">
                            리뷰 라벨
                        </label>
                        <p className="text-xs text-[#6B6766] mb-3">
                            현재 대상 타입: <span className="font-bold text-primary">{form.targetType}</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {availableLabels.map((label) => {
                                const active = form.labelNames.includes(label);
                                return (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => toggleLabel(label)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                                            active
                                                ? 'bg-[#FFF0F3] border-primary text-primary'
                                                : 'bg-white border-[#EAE5E3] text-[#6B6766]'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider block mb-2">
                            리뷰 내용
                        </label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                            className="w-full min-h-[180px] bg-gray-50 border border-[#EAE5E3] rounded-xl py-4 px-4 text-sm font-medium resize-none leading-relaxed focus:bg-white focus:outline-none focus:border-primary"
                            placeholder="리뷰 내용을 입력해주세요."
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-[#EAE5E3] flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-100 text-[#1F1D1D] rounded-xl font-bold text-sm"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => onSubmit(form)}
                        disabled={loading}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm"
                    >
                        {loading ? '처리 중...' : mode === 'create' ? '등록' : '수정'}
                    </button>
                </div>
            </div>
        </div>
    );
}