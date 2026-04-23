import React from 'react';
import CommonButton from '../CommonButton';
import { SIDEBAR_MENUS } from '../../constants/mypageConstants';

export default function Sidebar({ activeTab, setActiveTab }) {
    return (
        <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white p-8 rounded-2xl flex flex-col gap-8 border border-[#EAE5E3] shadow-sm sticky top-28">
                <nav className="flex flex-col space-y-1">
                    {SIDEBAR_MENUS.map(({ key, label, icon }) => (
                        <CommonButton
                            key={key}
                            variant="toggle"
                            size="tab"
                            fullWidth
                            active={key === activeTab}
                            activeClassName="bg-[#FFF0F3] text-primary font-bold"
                            inactiveClassName="text-[#6B6766] hover:bg-[#FFF0F3]/50 hover:text-primary"
                            className="justify-start px-4"
                            icon={
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    style={key === activeTab ? { fontVariationSettings: "'FILL' 1" } : {}}
                                >
                  {icon}
                </span>
                            }
                            iconPosition="left"
                            onClick={() => setActiveTab(key)}
                        >
                            <span>{label}</span>
                        </CommonButton>
                    ))}

                    <CommonButton
                        variant="toggle"
                        size="tab"
                        fullWidth
                        inactiveClassName="text-[#6B6766] hover:bg-[#FFF0F3]/50 hover:text-primary"
                        className="justify-start px-4"
                        icon={<span className="material-symbols-outlined text-[20px]">logout</span>}
                        iconPosition="left"
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('member');
                            window.location.href = '/';
                        }}
                    >
                        <span>로그아웃</span>
                    </CommonButton>
                </nav>
            </div>
        </aside>
    );
}