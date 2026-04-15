import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

export default function ApplyFormPage() {
  const navigate = useNavigate();

  const [resumeDropdownOpen, setResumeDropdownOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState({ value: '', label: '제출할 이력서를 선택해주세요' });
  const [consent, setConsent] = useState(false);
  const [showError, setShowError] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState('');
  const dropdownRef = useRef(null);

  const resumeOptions = [
    { value: 'basic', label: '기본 이력서', updatedAt: '2024.05.20' },
    { value: 'logistics', label: '물류 단기 알바용 이력서', updatedAt: '2024.03.15' },
    { value: 'cafe', label: '카페 경력 위주 이력서', updatedAt: '2023.12.01' },
  ];

  const isFormValid = selectedResume.value !== '' && consent;

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setResumeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      navigate('/apply-complete');
    } else {
      setShowError(true);
    }
  };

  const handleResumeSelect = (option) => {
    setSelectedResume(option);
    setResumeDropdownOpen(false);
    setShowError(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-on-surface">
      <TopNavBar />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 w-full flex-grow">
        {/* Title */}
        <div className="mb-12">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-3 block">
            지원 프로세스
          </span>
          <h1 className="text-4xl font-black tracking-tight text-on-surface leading-tight">
            온라인 지원하기
          </h1>
        </div>

        <form className="space-y-10" onSubmit={handleSubmit}>
          {/* Section 1: 지원 대상 공고 */}
          <section className="bg-white border border-outline p-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">
                  지원 대상 공고
                </p>
                <h2 className="text-2xl font-bold mb-1">
                  [긴급] 오늘 야간 편의점 대타 급구 (시급 1.5배)
                </h2>
                <div className="flex flex-wrap items-center text-on-surface-variant gap-4 text-sm font-medium mt-2">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">business</span>
                    CU 서초중앙점
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    서울특별시 서초구
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-4xl opacity-20">storefront</span>
            </div>
          </section>

          {/* Section 2: 지원자 정보 및 기본 이력서 */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              지원자 정보 및 기본 이력서{' '}
              <span className="text-primary text-xs font-bold">[필수]</span>
            </h3>
            <div className="bg-white border border-outline p-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block">
                    이름
                  </label>
                  <p className="text-base font-semibold">홍길동</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block">
                    연락처
                  </label>
                  <p className="text-base font-semibold">010-1234-5678</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block">
                    이메일
                  </label>
                  <p className="text-base font-semibold">hong.gildong@example.com</p>
                </div>
              </div>

              {/* 이력서 선택 드롭다운 */}
              <div className="relative" ref={dropdownRef}>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-2 block">
                  제출할 이력서 선택
                </label>
                <button
                  type="button"
                  className="w-full flex justify-between items-center bg-white border border-outline p-4 hover:border-primary transition-all text-left"
                  onClick={() => setResumeDropdownOpen(!resumeDropdownOpen)}
                >
                  <span
                    className={`text-sm ${
                      selectedResume.value
                        ? 'text-on-surface font-bold'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {selectedResume.label}
                  </span>
                  <span
                    className="material-symbols-outlined text-on-surface-variant transition-transform duration-200"
                    style={{ transform: resumeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    expand_more
                  </span>
                </button>

                {resumeDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-outline shadow-xl z-20 divide-y divide-outline">
                    {resumeOptions.map((option) => (
                      <div
                        key={option.value}
                        className="p-4 cursor-pointer hover:bg-primary-soft transition-colors"
                        onClick={() => handleResumeSelect(option)}
                      >
                        <p className="text-sm font-bold text-on-surface">{option.label}</p>
                        <p className="text-[11px] text-on-surface-variant">
                          마지막 업데이트: {option.updatedAt}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section 3: 추가 파일 첨부 */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold">추가 파일 첨부</h3>
            <div className="bg-white border border-dashed border-outline p-8 text-center group hover:border-primary transition-colors cursor-pointer">
              <input
                className="hidden"
                id="file_upload"
                type="file"
                onChange={(e) => setUploadedFile(e.target.files[0])}
              />
              <label className="cursor-pointer" htmlFor="file_upload">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary mb-2 text-3xl block">
                  upload_file
                </span>
                {uploadedFile ? (
                  <p className="text-sm font-bold text-primary">{uploadedFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium">새 파일 업로드</p>
                    <p className="text-[11px] text-on-surface-variant mt-1">
                      기업 전용 양식 또는 자격증 사본 (PDF, DOCX 최대 10MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </section>

          {/* Section 4: 추가 메시지 */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">추가 메시지</h3>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">선택 사항</span>
            </div>
            <textarea
              className="w-full bg-white border border-outline p-4 min-h-[120px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm placeholder:text-on-surface-variant/50 resize-none"
              placeholder="본 직무에 적합한 본인만의 강점을 짧게 적어주세요..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </section>

          {/* Section 5: 확인 요약 및 동의 */}
          <section className="bg-surface-container p-6 space-y-6">
            <div className="text-sm space-y-3">
              <div className="flex justify-between border-b border-outline pb-2">
                <span className="text-on-surface-variant">지원 기업</span>
                <span className="font-bold">CU 서초중앙점</span>
              </div>
              <div className="flex justify-between border-b border-outline pb-2">
                <span className="text-on-surface-variant">지원자 이름</span>
                <span className="font-bold">홍길동</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary border-outline cursor-pointer accent-primary"
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    setShowError(false);
                  }}
                />
                <label
                  className="text-xs text-on-surface-variant leading-relaxed cursor-pointer"
                  htmlFor="consent"
                >
                  본인은 개인정보 수집 및 이용에 동의하며, 제공된 정보가 사실임을 확인합니다.{' '}
                  <span className="text-primary underline font-bold">개인정보 취급 방침</span>에
                  따라 지원서 내용이 해당 기업에 전달됩니다. (필수)
                </label>
              </div>
            </div>
          </section>

          {/* 제출 버튼 */}
          <div className="pt-4">
            {showError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center">
                필수 항목을 모두 입력해야 제출이 가능합니다.
              </div>
            )}
            <CommonButton
              type="submit"
              disabled={!isFormValid}
              size="fullLg"
              className={isFormValid ? 'rounded-lg' : 'rounded-lg bg-primary/50 hover:bg-primary/50'}
              icon={<span className="material-symbols-outlined">send</span>}
            >
              온라인 지원서 제출
            </CommonButton>
            <div className="flex items-center justify-center gap-2 mt-6">
              <span
                className="material-symbols-outlined text-primary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-tight">
                평균 응답 대기 시간: 약 15분
              </p>
            </div>
          </div>
        </form>
      </main>

      <AppFooter />
    </div>
  );
}
