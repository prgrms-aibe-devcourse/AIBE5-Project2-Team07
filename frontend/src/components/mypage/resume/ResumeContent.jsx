import React, { useState } from 'react';
import { formatDate, getBusinessTypeLabel } from '../../../utils/mypageUtils';
import ResumeEditForm from './ResumeEditForm';

export default function ResumeContent({ resume, onResumeChanged }) {
    const [view, setView] = useState('list');

    if (view === 'edit') {
        return (
            <ResumeEditForm
                mode={resume ? 'edit' : 'create'}
                initialResume={resume}
                onBack={() => setView('list')}
                onSaved={(updatedResume) => {
                    onResumeChanged(updatedResume);
                    setView('list');
                }}
            />
        );
    }

    return (
        <section className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#1F1D1D]">이력서 관리</h1>
                    <p className="text-[#6B6766] mt-1 text-sm">작성하신 이력서를 관리하고 수정할 수 있습니다.</p>
                </div>

                <button
                    onClick={() => setView('edit')}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-[#D61F44] transition-transform active:scale-95 shadow-md shadow-primary/10"
                >
                    <span className="material-symbols-outlined text-lg">{resume ? 'edit' : 'add'}</span>
                    <span className="text-sm">{resume ? '이력서 수정' : '이력서 작성'}</span>
                </button>
            </div>

            {resume ? (
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border border-primary/20 shadow-sm ring-1 ring-primary/5">
                        <div className="absolute top-0 right-0 p-4">
              <span className="bg-[#FFF0F3] text-primary text-[10px] font-bold px-3 py-1 rounded-full">
                내 이력서
              </span>
                        </div>

                        <div className="space-y-5">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#FFF0F3] flex-shrink-0 border border-[#EAE5E3] flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-3xl">person</span>
                            </div>

                            <div>
                                <h3 className="text-lg font-extrabold text-[#1F1D1D] leading-snug">
                                    {resume.title || '이력서 제목 없음'}
                                </h3>
                                <p className="text-[11px] font-medium text-[#6B6766] mt-1.5 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">history</span>
                                    최종 수정일: {formatDate(resume.updatedAt)}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {(resume.desiredBusinessTypes || []).map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-gray-50 border border-[#EAE5E3] px-2 py-0.5 rounded text-[10px] font-bold text-[#6B6766]"
                                    >
                    #{getBusinessTypeLabel(item)}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-8">
                            <button
                                onClick={() => setView('edit')}
                                className="flex-1 bg-white text-[#1F1D1D] border border-[#EAE5E3] py-2.5 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors"
                            >
                                수정
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-8 border border-[#EAE5E3] shadow-sm">
                    <div className="flex flex-col items-center justify-center min-h-[280px] text-center">
                        <div className="w-14 h-14 bg-[#FFF0F3] rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-primary text-3xl">description</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-[#1F1D1D] mb-2">등록된 이력서가 없습니다</h3>
                        <p className="text-sm text-[#6B6766] mb-6">
                            개인회원은 이력서를 1개만 등록할 수 있습니다. 먼저 이력서를 작성해 주세요.
                        </p>
                        <button
                            onClick={() => setView('edit')}
                            className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#D61F44] transition-all"
                        >
                            이력서 작성하기
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}