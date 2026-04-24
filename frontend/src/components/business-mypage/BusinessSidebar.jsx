import React, { useState } from 'react';
import CommonButton from '../../components/CommonButton';
import { deleteMyBusinessAccount } from '../../services/accountApi';
import { businessSidebarItems } from './businessSidebarItems';

export default function BusinessSidebar({ activeTab, onChangeTab, navigate, companySummary }) {
    const companyName = companySummary?.companyName || '기업명 정보 없음';
    const businessNumber = companySummary?.businessNumber || '-';
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('member');
        navigate('/');
    };

    const handleOpenDeleteModal = () => {
        setDeletePassword('');
        setDeleteError('');
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (isDeleting) return;
        setIsDeleteModalOpen(false);
        setDeletePassword('');
        setDeleteError('');
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword.trim()) {
            setDeleteError('비밀번호를 입력해주세요.');
            return;
        }

        try {
            setIsDeleting(true);
            setDeleteError('');
            await deleteMyBusinessAccount({ password: deletePassword });
            window.alert('회원 탈퇴가 완료되었습니다.');
            handleLogout();
        } catch (error) {
            setDeleteError(error?.message || '회원 탈퇴에 실패했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-outline p-6 sticky top-28">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 bg-primary-soft rounded-2xl flex items-center justify-center mb-4 border border-primary/10">
                        <span className="material-symbols-outlined text-4xl text-primary">apartment</span>
                    </div>

                    <div className="flex items-center gap-1 mb-1">
                        <h2 className="font-bold text-lg">{companyName}</h2>
                        <span
                            className="material-symbols-outlined text-primary text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
              verified
            </span>
                    </div>

                    <p className="text-xs text-on-surface-variant">사업자번호 {businessNumber}</p>

                    <CommonButton
                        type="button"
                        onClick={() => navigate('/dashboard/recruit-create')}
                        size="full"
                        className="mt-4"
                        icon={<span className="material-symbols-outlined text-sm">add</span>}
                    >
                        공고 등록하기
                    </CommonButton>

                    <CommonButton
                        type="button"
                        variant="subtle"
                        size="sm"
                        fullWidth
                        className="mt-2 text-xs"
                        onClick={() => navigate('/dashboard/company-edit')}
                    >
                        기업 정보 수정
                    </CommonButton>
                </div>

                <nav className="space-y-1">
                    {businessSidebarItems.map((item) => {
                        const isActive = item.id === activeTab;

                        return (
                            <CommonButton
                                key={item.id}
                                type="button"
                                onClick={() => onChangeTab(item.id)}
                                variant="toggle"
                                size="tab"
                                fullWidth
                                active={isActive}
                                activeClassName="bg-primary-soft text-primary font-bold"
                                inactiveClassName="text-on-surface-variant hover:bg-gray-50"
                                className="justify-start px-4"
                                icon={
                                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                }
                                iconPosition="left"
                            >
                                {item.label}
                            </CommonButton>
                        );
                    })}

                    <CommonButton
                        type="button"
                        onClick={handleLogout}
                        variant="toggle"
                        size="tab"
                        fullWidth
                        inactiveClassName="text-on-surface-variant hover:bg-gray-50"
                        className="justify-start px-4"
                        icon={<span className="material-symbols-outlined text-[20px]">logout</span>}
                        iconPosition="left"
                    >
                        로그아웃
                    </CommonButton>
                </nav>

                <div className="mt-8 pt-6 border-t border-outline">
                    <button
                        type="button"
                        onClick={handleOpenDeleteModal}
                        className="text-xs text-on-surface-variant hover:text-primary transition-colors"
                    >
                        회원 탈퇴하기
                    </button>
                </div>
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white border border-outline p-6">
                        <h3 className="text-base font-bold text-on-surface">회원 탈퇴</h3>
                        <p className="mt-2 text-sm text-on-surface-variant">
                            비밀번호를 입력하면 계정이 삭제됩니다.
                        </p>

                        <label className="mt-4 block">
                            <span className="text-xs font-bold text-on-surface-variant mb-2 block">비밀번호</span>
                            <input
                                type="password"
                                value={deletePassword}
                                onChange={(event) => setDeletePassword(event.target.value)}
                                className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            />
                        </label>

                        {deleteError && (
                            <p className="mt-2 text-xs text-red-500">{deleteError}</p>
                        )}

                        <div className="mt-5 flex justify-end gap-2">
                            <CommonButton
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCloseDeleteModal}
                                disabled={isDeleting}
                            >
                                취소
                            </CommonButton>
                            <CommonButton
                                type="button"
                                size="sm"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                            >
                                {isDeleting ? '탈퇴 중...' : '탈퇴'}
                            </CommonButton>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}