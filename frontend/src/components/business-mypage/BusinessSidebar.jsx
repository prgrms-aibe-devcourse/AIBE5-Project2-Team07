import React from 'react';
import CommonButton from '../../components/CommonButton';

export const businessSidebarItems = [
    { id: 'dashboard', label: '대시보드', icon: 'dashboard' },
    { id: 'recruits', label: '공고 관리', icon: 'assignment' },
    { id: 'applicants', label: '지원자 현황', icon: 'group' },
    { id: 'reviews', label: '리뷰 관리', icon: 'rate_review' },
    { id: 'work', label: '근무 관리', icon: 'calendar_today' },
    { id: 'scrap', label: '스크랩 회원', icon: 'bookmark' },
];

export default function BusinessSidebar({ activeTab, onChangeTab, navigate }) {
    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-outline p-6 sticky top-28">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 bg-primary-soft rounded-2xl flex items-center justify-center mb-4 border border-primary/10">
                        <span className="material-symbols-outlined text-4xl text-primary">apartment</span>
                    </div>

                    <div className="flex items-center gap-1 mb-1">
                        <h2 className="font-bold text-lg">서울 에디토리얼</h2>
                        <span
                            className="material-symbols-outlined text-primary text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
              verified
            </span>
                    </div>

                    <p className="text-xs text-on-surface-variant">사업자번호 123-45-67890</p>

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
                    <button className="text-xs text-on-surface-variant hover:text-primary transition-colors">
                        회원 탈퇴하기
                    </button>
                </div>
            </div>
        </aside>
    );
}