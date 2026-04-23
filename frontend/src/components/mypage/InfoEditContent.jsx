import React, { useEffect, useState } from 'react';
import { getMyAccount, updateMyAccount, deleteMyAccount } from '../../services/accountApi';

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
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                    localStorage.setItem(
                        'member',
                        JSON.stringify({
                            ...parsed,
                            phone: refreshed.phone,
                            image: refreshed.image,
                        })
                    );
                } catch (e) {}
            }

            setForm((prev) => ({
                ...prev,
                password: '',
            }));
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
            setMessage('');
            setError('');

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

    return (
        <section className="flex-grow space-y-8">
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#EAE5E3] shadow-sm">
                <header className="mb-10">
                    <h3 className="text-3xl font-black tracking-tight text-[#1F1D1D] mb-2">정보 수정</h3>
                    <p className="text-[#6B6766] font-medium text-sm">
                        현재 백엔드 기준으로 휴대폰, 비밀번호, 프로필 이미지, 주소 수정이 가능합니다.
                    </p>
                </header>

                <div className="space-y-10">
                    <div className="flex items-center space-x-8 pb-10 border-b border-[#EAE5E3]/50">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#FFF0F3] shadow-inner bg-gray-100 flex items-center justify-center">
                                {form.image ? (
                                    <img src={form.image} alt="프로필" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-[#6B6766] text-6xl">person</span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">프로필 이미지 URL</h4>
                            <input
                                type="text"
                                name="image"
                                value={form.image}
                                onChange={handleChange}
                                placeholder="이미지 URL 입력"
                                className="w-full bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-medium text-[#1F1D1D] text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-xl font-bold text-[#1F1D1D]">기본 정보</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">
                                    이름
                                </label>
                                <input
                                    type="text"
                                    value={account?.name || ''}
                                    disabled
                                    className="w-full bg-gray-100 border border-[#EAE5E3] rounded-xl px-5 py-4 font-bold text-[#6B6766] text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">
                                    휴대폰 번호
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">
                                    이메일 주소
                                </label>
                                <input
                                    type="email"
                                    value={account?.email || ''}
                                    disabled
                                    className="w-full bg-gray-100 border border-[#EAE5E3] rounded-xl px-5 py-4 font-bold text-[#6B6766] text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">
                                    시/도
                                </label>
                                <input
                                    type="text"
                                    name="sido"
                                    value={form.sido}
                                    onChange={handleChange}
                                    placeholder="예: 서울특별시"
                                    className="w-full bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-medium text-[#1F1D1D] text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">
                                    시/군/구
                                </label>
                                <input
                                    type="text"
                                    name="sigungu"
                                    value={form.sigungu}
                                    onChange={handleChange}
                                    placeholder="예: 강남구"
                                    className="w-full bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-medium text-[#1F1D1D] text-sm"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">
                                    상세 주소
                                </label>
                                <input
                                    type="text"
                                    name="detailAddress"
                                    value={form.detailAddress}
                                    onChange={handleChange}
                                    placeholder="상세 주소 입력"
                                    className="w-full bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-medium text-[#1F1D1D] text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 pt-4">
                        <h4 className="text-xl font-bold text-[#1F1D1D]">비밀번호 변경</h4>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#6B6766] uppercase tracking-wider px-1">
                                    새 비밀번호
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="새 비밀번호 입력"
                                    className="w-full bg-[#F8F9FA] border border-[#EAE5E3] rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all font-bold text-[#1F1D1D] text-sm"
                                />
                            </div>
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
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                        >
                            {deleting ? '탈퇴 처리 중...' : '회원 탈퇴하기'}
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="px-10 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-[#D61F44] active:scale-[0.98] transition-all text-sm shadow-md shadow-primary/10"
                        >
                            {saving ? '저장 중...' : '저장하기'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}