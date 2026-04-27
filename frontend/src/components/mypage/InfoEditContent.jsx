import React, { useEffect, useRef, useState } from 'react';
import { getMyAccount, updateMyAccount, deleteMyAccount } from '../../services/accountApi';
import { uploadProfileImage } from '../../services/fileApi';

export default function InfoEditContent({ account, onAccountChanged }) {
    const [form, setForm] = useState({
        phone: account?.phone || '',
        image: account?.image || '',
        password: '',
        sido: '',
        sigungu: '',
        detailAddress: '',
    });

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        setForm({
            phone: account?.phone || '',
            image: account?.image || '',
            password: '',
            sido: '',
            sigungu: '',
            detailAddress: account?.address || '',
        });
    }, [account]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            setError('');
            const result = await uploadProfileImage(file, form.image || null);
            setForm((prev) => ({ ...prev, image: result.url }));
        } catch (err) {
            setError(err.message || '이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage('');
            setError('');

            const payload = {
                phone: form.phone,
                image: form.image,
            };

            if (form.password.trim()) payload.password = form.password;
            if (form.sido.trim()) payload.sido = form.sido;
            if (form.sigungu.trim()) payload.sigungu = form.sigungu;
            if (form.detailAddress.trim()) payload.detailAddress = form.detailAddress;

            await updateMyAccount(payload);
            const refreshed = await getMyAccount();
            onAccountChanged(refreshed);

            const memberStr = localStorage.getItem('member');
            if (memberStr) {
                try {
                    const parsed = JSON.parse(memberStr);
                    localStorage.setItem('member', JSON.stringify({ ...parsed, phone: refreshed.phone, image: refreshed.image }));
                } catch (e) {}
            }

            setForm((prev) => ({ ...prev, password: '' }));
            setMessage('회원 정보가 수정되었습니다.');
        } catch (err) {
            setError(err.message || '회원 정보 수정 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const ok = window.confirm('정말 회원 탈퇴하시겠습니까?');
        if (!ok) return;
        try {
            setDeleting(true);
            await deleteMyAccount();
            localStorage.removeItem('token');
            localStorage.removeItem('member');
            window.location.href = '/';
        } catch (err) {
            setError(err.message || '회원 탈퇴 중 오류가 발생했습니다.');
        } finally {
            setDeleting(false);
        }
    };

    const LABEL = 'text-sm font-bold text-[#6B6766] px-1 block mb-1.5';
    const INPUT = 'w-full bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-medium text-[#1F1D1D] text-base';
    const INPUT_DISABLED = 'w-full bg-gray-100 border border-[#EAE5E3] rounded-xl px-5 py-4 font-bold text-[#6B6766] text-base';

    return (
        <section className="flex-grow space-y-8">
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#EAE5E3] shadow-sm">
                <header className="mb-10">
                    <h3 className="text-3xl font-black tracking-tight text-[#1F1D1D] mb-2">정보 수정</h3>
                    <p className="text-[#6B6766] font-medium text-sm">
                        휴대폰, 비밀번호, 프로필 이미지, 주소 수정이 가능합니다.
                    </p>
                </header>

                <div className="space-y-10">
                    {/* 프로필 이미지 */}
                    <div className="flex items-center space-x-8 pb-10 border-b border-[#EAE5E3]/50">
                        <div
                            className="relative group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#FFF0F3] shadow-inner bg-gray-100 flex items-center justify-center">
                                {form.image ? (
                                    <img src={form.image} alt="프로필" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-[#6B6766] text-6xl">person</span>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h4 className="font-bold text-lg mb-2">프로필 이미지</h4>
                            <p className="text-sm text-[#6B6766] mb-3">이미지를 클릭하거나 아래 버튼으로 변경하세요.</p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="px-5 py-2.5 rounded-xl bg-white border border-[#EAE5E3] text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-60"
                            >
                                {uploading ? '업로드 중...' : '이미지 변경'}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageFileChange}
                            />
                        </div>
                    </div>

                    {/* 기본 정보 */}
                    <div className="space-y-8">
                        <h4 className="text-xl font-bold text-[#1F1D1D]">기본 정보</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                            <div className="space-y-1">
                                <label className={LABEL}>이름</label>
                                <input type="text" value={account?.name || ''} disabled className={INPUT_DISABLED} />
                            </div>

                            <div className="space-y-1">
                                <label className={LABEL}>휴대폰 번호</label>
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={INPUT} />
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className={LABEL}>이메일 주소</label>
                                <input type="email" value={account?.email || ''} disabled className={INPUT_DISABLED} />
                            </div>

                            <div className="space-y-1">
                                <label className={LABEL}>시/도</label>
                                <input type="text" name="sido" value={form.sido} onChange={handleChange} placeholder="예: 서울특별시" className={INPUT} />
                            </div>

                            <div className="space-y-1">
                                <label className={LABEL}>시/군/구</label>
                                <input type="text" name="sigungu" value={form.sigungu} onChange={handleChange} placeholder="예: 강남구" className={INPUT} />
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className={LABEL}>상세 주소</label>
                                <input type="text" name="detailAddress" value={form.detailAddress} onChange={handleChange} placeholder="상세 주소 입력" className={INPUT} />
                            </div>
                        </div>
                    </div>

                    {/* 비밀번호 변경 */}
                    <div className="space-y-8 pt-4">
                        <h4 className="text-xl font-bold text-[#1F1D1D]">비밀번호 변경</h4>
                        <div className="space-y-1">
                            <label className={LABEL}>새 비밀번호</label>
                            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="새 비밀번호 입력" className={INPUT} />
                        </div>
                    </div>

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

                    <div className="flex justify-between items-center pt-8 border-t border-[#EAE5E3]/50">
                        <button type="button" onClick={handleDelete} disabled={deleting} className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
                            {deleting ? '탈퇴 처리 중...' : '회원 탈퇴하기'}
                        </button>
                        <button type="button" onClick={handleSave} disabled={saving} className="px-10 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-[#D61F44] active:scale-[0.98] transition-all text-sm shadow-md shadow-primary/10">
                            {saving ? '저장 중...' : '저장하기'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}