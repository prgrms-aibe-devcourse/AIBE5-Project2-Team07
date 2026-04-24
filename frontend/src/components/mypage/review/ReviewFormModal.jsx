import React, { useEffect, useMemo, useState } from 'react';
import { REVIEW_LABEL_OPTIONS_BY_TARGET } from '../../../constants/reviewConstants';

function getApplyCardTitle(apply) {
    return apply?.recruitTitle || `지원 #${apply?.id ?? '-'}`;
}

function getApplyCardSubtitle(apply) {
    return apply?.companyName || `recruitId: ${apply?.recruitId ?? '-'}`;
}

function formatApplyDate(dateString) {
    if (!dateString) return '-';
    return String(dateString).slice(0, 10).replace(/-/g, '.');
}

export default function ReviewFormModal({
                                            open,
                                            mode,
                                            initialValue,
                                            onClose,
                                            onSubmit,
                                            loading,
                                            reviewableApplies = [],
                                        }) {
    const [form, setForm] = useState(initialValue);
    const [selectedApplyId, setSelectedApplyId] = useState(initialValue?.applyId || '');

    useEffect(() => {
        setForm(initialValue);
        setSelectedApplyId(initialValue?.applyId || '');
    }, [initialValue]);

    useEffect(() => {
        const allowed = REVIEW_LABEL_OPTIONS_BY_TARGET[form.targetType] || [];
        setForm((prev) => ({
            ...prev,
            labelNames: prev.labelNames.filter((label) => allowed.includes(label)),
        }));
    }, [form.targetType]);

    const availableLabels = useMemo(() => {
        return REVIEW_LABEL_OPTIONS_BY_TARGET[form.targetType] || [];
    }, [form.targetType]);

    const selectedApply = useMemo(() => {
        return reviewableApplies.find((item) => String(item.id) === String(selectedApplyId)) || null;
    }, [reviewableApplies, selectedApplyId]);

    const toggleLabel = (label) => {
        setForm((prev) => ({
            ...prev,
            labelNames: prev.labelNames.includes(label)
                ? prev.labelNames.filter((item) => item !== label)
                : [...prev.labelNames, label],
        }));
    };

    const handleSelectApply = (apply) => {
        setSelectedApplyId(String(apply.id));
        setForm((prev) => ({
            ...prev,
            applyId: String(apply.id),
        }));
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

            <div className="relative w-full max-w-5xl bg-white rounded-2xl border border-[#EAE5E3] shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-[#EAE5E3] flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-extrabold text-[#1F1D1D]">
                            {mode === 'create' ? '리뷰 작성' : '리뷰 수정'}
                        </h3>
                        <p className="text-xs text-[#6B6766] mt-1">
                            {mode === 'create'
                                ? '완료된 지원 건을 선택한 뒤 리뷰를 작성해주세요.'
                                : '리뷰 내용을 수정해주세요.'}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#6B6766]">close</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
                    {mode === 'create' && (
                        <div className="border-r border-[#EAE5E3] bg-gray-50/50">
                            <div className="px-5 py-4 border-b border-[#EAE5E3]">
                                <h4 className="text-sm font-bold text-[#1F1D1D]">완료된 지원 목록</h4>
                                <p className="text-xs text-[#6B6766] mt-1">완료된 지원 건을 선택하세요</p>
                            </div>

                            <div className="max-h-[560px] overflow-y-auto">
                                {reviewableApplies.length > 0 ? (
                                    <div className="divide-y divide-[#EAE5E3]">
                                        {reviewableApplies.map((apply) => {
                                            const active = String(selectedApplyId) === String(apply.id);

                                            return (
                                                <button
                                                    key={apply.id}
                                                    type="button"
                                                    onClick={() => handleSelectApply(apply)}
                                                    className={`w-full text-left px-5 py-4 transition-colors ${
                                                        active ? 'bg-[#FFF0F3]' : 'hover:bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-bold text-[#1F1D1D] truncate">
                                                                {getApplyCardTitle(apply)}
                                                            </div>
                                                            <div className="text-xs text-[#6B6766] mt-1 truncate">
                                                                {getApplyCardSubtitle(apply)}
                                                            </div>
                                                            <div className="text-[11px] text-[#6B6766] mt-2">
                                                                지원일 {formatApplyDate(apply.createdAt)}
                                                            </div>
                                                        </div>

                                                        {active && (
                                                            <span className="material-symbols-outlined text-primary text-lg shrink-0">
                                check_circle
                              </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="px-5 py-10 text-sm text-[#6B6766]">
                                        리뷰 작성 가능한 완료된 지원 건이 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="p-6 space-y-6">
                        {mode === 'create' && (
                            <div className="bg-[#FFF8FA] border border-[#F6DDE3] rounded-xl px-4 py-4">
                                <div className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider mb-2">
                                    선택한 지원
                                </div>

                                {selectedApply ? (
                                    <div>
                                        <div className="text-sm font-bold text-[#1F1D1D]">
                                            {getApplyCardTitle(selectedApply)}
                                        </div>
                                        <div className="text-xs text-[#6B6766] mt-1">
                                            {getApplyCardSubtitle(selectedApply)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-[#6B6766]">
                                        왼쪽 목록에서 완료된 지원 건을 선택해주세요.
                                    </div>
                                )}
                            </div>
                        )}

                        {mode === 'edit' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 border border-[#EAE5E3] rounded-xl px-4 py-3">
                                    <div className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider">
                                        리뷰 대상
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-[#1F1D1D]">
                                        {form.targetName || '-'}
                                    </div>
                                </div>

                                <div className="bg-gray-50 border border-[#EAE5E3] rounded-xl px-4 py-3">
                                    <div className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider">
                                        대상 유형
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-[#1F1D1D]">
                                        {form.targetType || '-'}
                                    </div>
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
                </div>

                <div className="px-6 py-4 border-t border-[#EAE5E3] flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-100 text-[#1F1D1D] rounded-xl font-bold text-sm"
                    >
                        취소
                    </button>

                    <button
                        onClick={() => onSubmit(form, selectedApply)}
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