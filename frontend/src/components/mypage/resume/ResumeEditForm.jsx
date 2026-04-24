import React, { useState } from 'react';
import { BUSINESS_TYPE_OPTIONS } from '../../../constants/mypageConstants';
import { getStoredMember, requestWithAuth } from '../../../services/authApi';
import {
    getMyResume,
    createResume,
    updateResume,
    deleteResume,
    createCareer,
    updateCareer,
    deleteCareer,
    createEducation,
    updateEducation,
    deleteEducation,
    createLicense,
    updateLicense,
    deleteLicense,
} from '../../../services/resumeApi';

import CareerSection from './CareerSection';
import EducationSection from './EducationSection';
import LicenseSection from './LicenseSection';
import RegionSection from './RegionSection';

export default function ResumeEditForm({
                                           mode,
                                           initialResume,
                                           onBack,
                                           onSaved,
                                       }) {
    const isCreateMode = mode === 'create';
    const storedMember = getStoredMember();
    const memberId = storedMember?.id;

    const [form, setForm] = useState({
        title: initialResume?.title || '',
        content: initialResume?.content || '',
        visibility: typeof initialResume?.visibility === 'boolean' ? initialResume.visibility : true,
        desiredBusinessTypes: Array.isArray(initialResume?.desiredBusinessTypes)
            ? initialResume.desiredBusinessTypes
            : [],
        preferredRegionIds: Array.isArray(initialResume?.preferredRegions)
            ? initialResume.preferredRegions.map((item) => Number(item.id))
            : [],
        isPhonePublic: initialResume?.phone && initialResume.phone !== '비공개',
        isActive: initialResume?.isActive ?? false, // 실시간 근무 가능 여부
    });

    const [careers, setCareers] = useState(
        Array.isArray(initialResume?.careers) && initialResume.careers.length > 0
            ? initialResume.careers.map((item) => ({
                id: item.id || null,
                company: item.company || '',
                role: item.role || '',
                startDate: item.startDate || '',
                endDate: item.endDate || '',
                brandId: item.brandId || null,
                businessType: '',
                careerType: item.brandId ? 'BRAND' : 'MANUAL',
                _deleted: false,
            }))
            : []
    );

    const [educations, setEducations] = useState(
        Array.isArray(initialResume?.educations) && initialResume.educations.length > 0
            ? initialResume.educations.map((item) => ({
                id: item.id || null,
                schoolName: item.schoolName || '',
                schoolType: item.schoolType || '',
                major: item.major || '',
                _deleted: false,
            }))
            : []
    );

    const [licenses, setLicenses] = useState(
        Array.isArray(initialResume?.licenses) && initialResume.licenses.length > 0
            ? initialResume.licenses.map((item) => ({
                id: item.id || null,
                licenseName: item.licenseName || '',
                licenseNumber: item.licenseNumber || '',
                acquisitionDate: item.acquisitionDate || '',
                issuedBy: item.issuedBy || '',
                licenseFileUrl: item.licenseFileUrl || '',
                _deleted: false,
            }))
            : []
    );

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleBaseChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleBusinessType = (typeValue) => {
        setForm((prev) => {
            const exists = prev.desiredBusinessTypes.includes(typeValue);
            return {
                ...prev,
                desiredBusinessTypes: exists
                    ? prev.desiredBusinessTypes.filter((item) => item !== typeValue)
                    : [...prev.desiredBusinessTypes, typeValue],
            };
        });
    };

    const syncCareers = async () => {
        const keptIds = [];

        for (const item of careers) {
            if (item._deleted) {
                if (item.id) await deleteCareer(item.id);
                continue;
            }

            if (!item.company && !item.role && !item.startDate && !item.endDate) {
                if (item.id) await deleteCareer(item.id);
                continue;
            }

            const payload = {
                memberId,
                company: item.company,
                role: item.role,
                startDate: item.startDate || null,
                endDate: item.endDate || null,
                brandId: item.brandId ?? null,
            };

            let saved;
            if (item.id) {
                saved = await updateCareer(item.id, payload);
            } else {
                saved = await createCareer(payload);
            }

            if (saved?.id) keptIds.push(saved.id);
        }

        return keptIds;
    };

    const syncEducations = async () => {
        const keptIds = [];

        for (const item of educations) {
            if (item._deleted) {
                if (item.id) await deleteEducation(item.id);
                continue;
            }

            if (!item.schoolName && !item.schoolType && !item.major) {
                if (item.id) await deleteEducation(item.id);
                continue;
            }

            const payload = {
                memberId,
                schoolName: item.schoolName,
                schoolType: item.schoolType,
                major: item.major,
            };

            let saved;
            if (item.id) {
                saved = await updateEducation(item.id, payload);
            } else {
                saved = await createEducation(payload);
            }

            if (saved?.id) keptIds.push(saved.id);
        }

        return keptIds;
    };

    const syncLicenses = async () => {
        const keptIds = [];

        for (const item of licenses) {
            if (item._deleted) {
                if (item.id) await deleteLicense(item.id);
                continue;
            }

            if (!item.licenseName && !item.licenseNumber && !item.acquisitionDate && !item.issuedBy) {
                if (item.id) await deleteLicense(item.id);
                continue;
            }

            const payload = {
                memberId,
                licenseName: item.licenseName,
                licenseNumber: item.licenseNumber,
                acquisitionDate: item.acquisitionDate || null,
                issuedBy: item.issuedBy,
                licenseFileUrl: item.licenseFileUrl || '',
            };

            let saved;
            if (item.id) {
                saved = await updateLicense(item.id, payload);
            } else {
                saved = await createLicense(payload);
            }

            if (saved?.id) keptIds.push(saved.id);
        }

        return keptIds;
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage('');
            setError('');

            if (!memberId) throw new Error('로그인 회원 정보를 찾을 수 없습니다.');
            if (!form.title.trim()) throw new Error('이력서 제목을 입력해주세요.');
            if (!form.content.trim()) throw new Error('자기소개를 입력해주세요.');

            const careerIds = await syncCareers();
            const educationIds = await syncEducations();
            const licenseIds = await syncLicenses();

            const payload = {
                title: form.title,
                visibility: form.visibility,
                content: form.content,
                careerIds,
                educationIds,
                licenseIds,
                desiredBusinessTypes: form.desiredBusinessTypes,
                preferredRegionIds: form.preferredRegionIds,
            };

            if (isCreateMode) {
                await createResume(payload);
            } else {
                await updateResume({
                    ...payload,
                    isPhonePublic: form.isPhonePublic,
                });
            }

            // 실시간 근무 가능 여부 저장: 항상 PATCH로 isActive 전달
            try {
                await requestWithAuth(`/personal/${memberId}/activate`, {
                    method: 'PATCH',
                    body: { isActive: !!form.isActive },
                });
            } catch (profileErr) {
                console.warn('실시간 근무 가능 여부 저장 실패 (무시):', profileErr.message);
            }

            const refreshedResume = await getMyResume();

            setMessage(isCreateMode ? '이력서가 등록되었습니다.' : '이력서가 수정되었습니다.');
            onSaved(refreshedResume);
        } catch (err) {
            console.error('handleSave error:', err);
            setError(err.message || '이력서 저장 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (isCreateMode) {
            onBack();
            return;
        }

        const ok = window.confirm('이력서를 삭제하시겠습니까?');
        if (!ok) return;

        try {
            setDeleting(true);
            setMessage('');
            setError('');

            await deleteResume();
            onSaved(null);
        } catch (err) {
            console.error('handleDelete error:', err);
            setError(err.message || '이력서 삭제 중 오류가 발생했습니다.');
        } finally {
            setDeleting(false);
        }
    };

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
                <h1 className="text-3xl font-black tracking-tight text-[#1F1D1D]">
                    {isCreateMode ? '이력서 작성' : '이력서 수정'}
                </h1>
                <p className="text-[#6B6766] mt-1 text-sm font-medium">
                    이력서 기본 정보와 경력·학력·자격증을 저장할 수 있습니다.
                </p>
            </div>

            <div className="space-y-6">
                <section className="bg-white p-8 rounded-2xl border border-[#EAE5E3] shadow-sm space-y-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-primary uppercase tracking-wider">
                            이력서 제목
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleBaseChange}
                            placeholder="예: 성실하고 실력 있는 서빙 전문 대타입니다"
                            className="w-full bg-gray-50 border border-[#EAE5E3] rounded-xl py-4 px-4 text-base font-bold text-[#1F1D1D] placeholder:text-[#6B6766]/40 transition-all focus:bg-white focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="pt-2">
                        <label className="text-sm font-bold text-[#6B6766] uppercase tracking-wider block mb-4">
                            인재정보 노출 설정
                        </label>
                        <div className="flex gap-8">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="visibility"
                                    checked={form.visibility === true}
                                    onChange={() => setForm((prev) => ({ ...prev, visibility: true }))}
                                    className="accent-primary w-4 h-4"
                                />
                                <span className="text-base font-bold text-[#1F1D1D]">노출함</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="visibility"
                                    checked={form.visibility === false}
                                    onChange={() => setForm((prev) => ({ ...prev, visibility: false }))}
                                    className="accent-primary w-4 h-4"
                                />
                                <span className="text-base font-bold text-[#1F1D1D]">노출하지 않음</span>
                            </label>
                        </div>
                    </div>

                    {!isCreateMode && (
                        <div className="pt-2">
                            <label className="text-sm font-bold text-[#6B6766] uppercase tracking-wider block mb-4">
                                휴대전화 공개 여부
                            </label>
                            <div className="flex gap-8">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="isPhonePublic"
                                        checked={form.isPhonePublic === true}
                                        onChange={() => setForm((prev) => ({ ...prev, isPhonePublic: true }))}
                                        className="accent-primary w-4 h-4"
                                    />
                                    <span className="text-base font-bold text-[#1F1D1D]">공개</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="isPhonePublic"
                                        checked={form.isPhonePublic === false}
                                        onChange={() => setForm((prev) => ({ ...prev, isPhonePublic: false }))}
                                        className="accent-primary w-4 h-4"
                                    />
                                    <span className="text-base font-bold text-[#1F1D1D]">비공개</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <label className="text-sm font-bold text-[#6B6766] uppercase tracking-wider block mb-4">
                            실시간 근무 가능 여부
                        </label>
                        <div className="flex gap-8">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isActive"
                                    checked={form.isActive === true}
                                    onChange={() => setForm((prev) => ({ ...prev, isActive: true }))}
                                    className="accent-primary w-4 h-4"
                                />
                                <span className="text-base font-bold text-[#1F1D1D]">가능</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isActive"
                                    checked={form.isActive === false}
                                    onChange={() => setForm((prev) => ({ ...prev, isActive: false }))}
                                    className="accent-primary w-4 h-4"
                                />
                                <span className="text-base font-bold text-[#1F1D1D]">불가능</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="text-sm font-bold text-[#6B6766] uppercase tracking-wider block mb-4">
                            희망 업직종
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {BUSINESS_TYPE_OPTIONS.map((type) => {
                                const active = form.desiredBusinessTypes.includes(type.value);

                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => toggleBusinessType(type.value)}
                                        className={`px-3 py-2 rounded-lg text-s font-bold border transition-colors ${
                                            active
                                                ? 'bg-[#FFF0F3] border-primary text-primary'
                                                : 'bg-white border-[#EAE5E3] text-[#6B6766]'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <RegionSection
                    value={form.preferredRegionIds}
                    onChange={(nextIds) =>
                        setForm((prev) => ({
                            ...prev,
                            preferredRegionIds: nextIds,
                        }))
                    }
                />

                <CareerSection careers={careers} setCareers={setCareers} />
                <EducationSection educations={educations} setEducations={setEducations} />
                <LicenseSection licenses={licenses} setLicenses={setLicenses} />

                <section className="bg-white p-8 rounded-2xl border border-[#EAE5E3] shadow-sm space-y-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-bold text-[#6B6766] uppercase tracking-wider">
                            자기소개
                        </label>
                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleBaseChange}
                            className="w-full min-h-[220px] bg-gray-50 border border-[#EAE5E3] rounded-xl py-4 px-4 text-sm font-medium resize-none leading-relaxed focus:bg-white focus:outline-none focus:border-primary"
                            placeholder="자신의 강점이나 대타 경험을 자유롭게 서술해주세요."
                        />
                    </div>
                </section>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm font-medium text-green-700">
                        {message}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-6">
                    {!isCreateMode && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="px-8 py-3.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors text-sm"
                        >
                            {deleting ? '삭제 중...' : '삭제'}
                        </button>
                    )}

                    <button
                        onClick={onBack}
                        className="px-8 py-3.5 bg-gray-100 text-[#1F1D1D] font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm"
                    >
                        취소
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-14 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-[#D61F44] active:scale-[0.98] transition-all text-sm shadow-md shadow-primary/10"
                    >
                        {saving ? '저장 중...' : '저장하기'}
                    </button>
                </div>
            </div>
        </section>
    );
}