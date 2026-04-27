import React from 'react';

export default function EducationSection({ educations, setEducations }) {
    const handleChange = (index, field, value) => {
        const copied = [...educations];
        copied[index] = {
            ...copied[index],
            [field]: value,
        };
        setEducations(copied);
    };

    const addEducation = () => {
        setEducations([
            ...educations,
            {
                id: null,
                schoolName: '',
                schoolType: '',
                major: '',
            },
        ]);
    };

    const removeEducation = (index) => {
        const copied = [...educations];
        const target = copied[index];

        if (!target) return;

        if (target.id) {
            copied[index] = {
                ...target,
                _deleted: true,
            };
        } else {
            copied.splice(index, 1);
        }

        setEducations(copied);
    };

    return (
        <section className="bg-white p-8 rounded-2xl border border-[#EAE5E3] shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-extrabold text-[#1F1D1D]">학력</h2>
            </div>

            <div className="space-y-4">
                {educations.map((education, index) => {
                    if (education._deleted) return null;

                    return (
                        <div
                            key={education.id || index}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50/50 p-5 rounded-xl border border-[#EAE5E3]/60 relative"
                        >
                            <div>
                                <label className="text-[13px] font-bold text-[#6B6766] block mb-1.5">학교명</label>
                                <input
                                    type="text"
                                    value={education.schoolName || ''}
                                    onChange={(e) => handleChange(index, 'schoolName', e.target.value)}
                                    className="w-full bg-white border border-[#EAE5E3] rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-primary/50"
                                />
                            </div>
                            <div>
                                <label className="text-[13px] font-bold text-[#6B6766] block mb-1.5">학력 구분</label>
                                <input
                                    type="text"
                                    value={education.schoolType || ''}
                                    onChange={(e) => handleChange(index, 'schoolType', e.target.value)}
                                    placeholder="예: 대학교"
                                    className="w-full bg-white border border-[#EAE5E3] rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-primary/50"
                                />
                            </div>
                            <div>
                                <label className="text-[13px] font-bold text-[#6B6766] block mb-1.5">전공</label>
                                <input
                                    type="text"
                                    value={education.major || ''}
                                    onChange={(e) => handleChange(index, 'major', e.target.value)}
                                    className="w-full bg-white border border-[#EAE5E3] rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={() => removeEducation(index)}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#EAE5E3] text-[#6B6766] hover:text-primary hover:border-primary/30 transition-colors bg-white"
                                >
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={addEducation}
                    className="w-full border-2 border-dashed border-[#EAE5E3]/60 py-5 rounded-2xl flex flex-col items-center justify-center gap-1 text-[#6B6766] hover:bg-[#FFF0F3]/10 hover:border-primary/30 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full border border-[#EAE5E3] flex items-center justify-center mb-1 group-hover:border-primary/30 group-hover:bg-white">
                        <span className="material-symbols-outlined text-xl group-hover:text-primary">add</span>
                    </div>
                    <span className="text-xs font-bold">학력 추가하기</span>
                </button>
            </div>
        </section>
    );
}