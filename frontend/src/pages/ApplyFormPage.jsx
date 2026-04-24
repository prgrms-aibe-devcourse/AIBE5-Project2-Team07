import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import { getStoredMember } from '../services/authApi';
const getToken = () => localStorage.getItem('token');
import { getMyAccount } from '../services/accountApi';
import { getMyResume } from '../services/resumeApi';
import { submitApply } from '../services/applyApi';
import { uploadPersonalResumeFile } from '../services/fileApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_PREFIXES = ['/api', ''];

async function fetchJsonWithFallback(path) {
  let lastError = null;

  for (const prefix of API_PREFIXES) {
    try {
      const response = await fetch(`${prefix}${path}`);
      if (response.ok) {
        return response.json();
      }
      if (response.status === 404) {
        continue;
      }
      const errorText = await response.text();
      throw new Error(errorText || `요청 실패 (${response.status})`);
    } catch (error) {
      lastError = error;
    }
  }

  try {
    const response = await fetch(`${API_BASE}${path}`);
    if (response.ok) {
      return response.json();
    }
    const errorText = await response.text();
    throw new Error(errorText || `요청 실패 (${response.status})`);
  } catch (error) {
    lastError = error;
  }

  throw lastError || new Error('지원 정보를 불러오지 못했습니다.');
}

function formatDateTime(dateText) {
  if (!dateText) {
    return '-';
  }

  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function getResumeId(resume) {
  return resume?.resumeId ?? resume?.id ?? '';
}

function normalizeKoreanAddressSpacing(text) {
  if (!text) {
    return '';
  }

  return String(text)
    .replace(/\s+/g, ' ')
    .replace(/(시|도)(?=[^\s])/g, '$1 ')
    .replace(/(군|구)(?=[^\s])/g, '$1 ')
    .replace(/(읍|면|동|리)(?=[^\s])/g, '$1 ')
    .trim();
}

function formatRecruitAddress(recruit) {
  const unitAddress = [recruit?.sido, recruit?.sigungu, recruit?.dong]
    .filter(Boolean)
    .join(' ');

  if (unitAddress) {
    return unitAddress;
  }

  const combined = [recruit?.regionName, recruit?.detailAddress].filter(Boolean).join(' ');
  return normalizeKoreanAddressSpacing(recruit?.fullAddress || combined) || '-';
}

export default function ApplyFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recruitId = searchParams.get('recruitId');

  const [selectedResume, setSelectedResume] = useState({ value: '', label: '이력서를 불러오는 중입니다' });
  const [consent, setConsent] = useState(false);
  const [showError, setShowError] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [account, setAccount] = useState(null);
  const [recruit, setRecruit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [resumeMissing, setResumeMissing] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const isFormValid = selectedResume.value !== '' && consent;

  useEffect(() => {
    const loadApplyData = async () => {
      const token = getToken();
      const member = getStoredMember();

      if (!recruitId) {
        setLoadError('공고 ID가 없습니다. 채용정보 페이지에서 다시 시도해주세요.');
        setLoading(false);
        return;
      }

      if (!token || !member) {
        setLoadError('로그인 후 지원서를 작성할 수 있습니다.');
        setLoading(false);
        return;
      }

      if (member.memberType !== 'INDIVIDUAL') {
        setAccessDeniedMessage('사업자 회원은 온라인 지원을 이용할 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError('');
        setAccessDeniedMessage('');
        setResumeMissing(false);

        const [accountData, recruitData] = await Promise.all([
          getMyAccount(),
          fetchJsonWithFallback(`/recruits/${recruitId}`),
        ]);

        setAccount(accountData);
        setRecruit(recruitData);

        try {
          const resumeData = await getMyResume();
          const mappedResume = {
            value: String(getResumeId(resumeData)),
            label: resumeData?.title || '내 이력서',
            updatedAt: resumeData?.updatedAt || '',
          };

          setSelectedResume(mappedResume);
        } catch (resumeError) {
          if (resumeError.message === 'Resume not found') {
            setResumeMissing(true);
            setSelectedResume({ value: '', label: '등록된 이력서가 없습니다' });
          } else {
            throw resumeError;
          }
        }
      } catch (error) {
        setLoadError(error.message || '지원 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadApplyData();
  }, [recruitId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setShowError(true);
      return;
    }

    const member = getStoredMember();

    try {
      setSubmitting(true);
      setSubmitError('');
      setShowError(false);

      let attachedFileUrl = '';
      if (uploadedFile) {
        const uploaded = await uploadPersonalResumeFile(uploadedFile);
        attachedFileUrl = uploaded?.url || '';
      }

      const result = await submitApply(
        {
          resumeId: Number(selectedResume.value),
          recruitId: Number(recruitId),
          method: 'ONLINE',
          message: message.trim(),
          attachedFileUrl,
          agree: consent,
        },
        member?.id,
      );

      navigate('/apply-complete', {
        state: {
          applyId: result?.id,
          recruitTitle: recruit?.title,
          companyName: recruit?.companyName,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      setSubmitError(error.message || '지원서 제출 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setUploadedFile(null);
      return;
    }

    const isAllowedExtension = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!isAllowedExtension) {
      setSubmitError('추가 파일은 PDF, DOC, DOCX 형식만 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSubmitError('추가 파일은 최대 10MB까지 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }

    setSubmitError('');
    setUploadedFile(file);
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFile(null);
    setSubmitError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-on-surface">
        <TopNavBar />
        <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 w-full flex-grow">
          <p className="text-on-surface-variant">지원 정보를 불러오는 중입니다...</p>
        </main>
        <AppFooter />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-on-surface">
        <TopNavBar />
        <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 w-full flex-grow">
          <div className="bg-white border border-outline p-8 rounded-2xl space-y-4">
            <h1 className="text-3xl font-black tracking-tight">온라인 지원하기</h1>
            <p className="text-red-600 font-medium">{loadError}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <CommonButton onClick={() => navigate('/login')}>로그인하러 가기</CommonButton>
              <CommonButton variant="subtle" onClick={() => navigate(-1)}>이전 페이지</CommonButton>
            </div>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  if (accessDeniedMessage) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-on-surface">
        <TopNavBar />
        <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 w-full flex-grow">
          <div className="bg-white border border-outline p-8 rounded-2xl space-y-4 text-center">
            <h1 className="text-3xl font-black tracking-tight">온라인 지원하기</h1>
            <p className="text-on-surface-variant">{accessDeniedMessage}</p>
            <CommonButton onClick={() => navigate(-1)}>이전 페이지로 돌아가기</CommonButton>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  if (resumeMissing) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-on-surface">
        <TopNavBar />
        <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 w-full flex-grow">
          <div className="bg-white border border-outline p-8 rounded-2xl space-y-5 text-center">
            <h1 className="text-3xl font-black tracking-tight">온라인 지원하기</h1>
            <p className="text-on-surface-variant leading-relaxed">
              온라인 지원을 하려면 먼저 이력서를 작성해야 합니다.<br />
              이력서 관리 탭으로 이동해 작성한 뒤 다시 지원해주세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <CommonButton onClick={() => navigate('/personal-mypage?tab=resume')}>이력서 작성하기</CommonButton>
              <CommonButton variant="subtle" onClick={() => navigate(-1)}>이전 페이지</CommonButton>
            </div>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

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
                  {recruit?.title || '-'}
                </h2>
                <div className="flex flex-wrap items-center text-on-surface-variant gap-4 text-sm font-medium mt-2">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">business</span>
                    {recruit?.companyName || '-'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {formatRecruitAddress(recruit)}
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
                  <p className="text-base font-semibold">{account?.name || '-'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block">
                    연락처
                  </label>
                  <p className="text-base font-semibold">{account?.phone || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block">
                    이메일
                  </label>
                  <p className="text-base font-semibold">{account?.email || '-'}</p>
                </div>
              </div>

              {/* 단일 이력서 표시 */}
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-2 block">
                  제출할 이력서
                </label>
                <div className="w-full bg-white border border-outline p-4">
                  <p className={`text-sm ${selectedResume.value ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                    {selectedResume.label}
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    마지막 업데이트: {formatDateTime(selectedResume.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: 추가 파일 첨부 */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">기업 이력서 첨부</h3>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">선택 사항</span>
            </div>
            <div className="bg-white border border-dashed border-outline p-8 text-center group hover:border-primary transition-colors">
              <input
                className="hidden"
                id="file_upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <label className="cursor-pointer" htmlFor="file_upload">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary mb-2 text-3xl block">
                  upload_file
                </span>
                <p className="text-sm font-medium">새 파일 업로드</p>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  기업 전용 양식 또는 자격증 사본 (PDF, DOCX 최대 10MB)
                </p>
              </label>

              {uploadedFile && (
                <div className="mt-4 inline-flex items-center gap-2 bg-primary-soft text-primary px-3 py-2 rounded-lg">
                  <p className="text-sm font-bold">{uploadedFile.name}</p>
                  <button
                    type="button"
                    onClick={handleRemoveUploadedFile}
                    className="w-5 h-5 rounded-full border border-primary/30 hover:bg-primary/10 text-xs leading-none"
                    aria-label="첨부 파일 삭제"
                  >
                    x
                  </button>
                </div>
              )}
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
                <span className="font-bold">{recruit?.companyName || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-outline pb-2">
                <span className="text-on-surface-variant">지원자 이름</span>
                <span className="font-bold">{account?.name || '-'}</span>
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
            {(showError || submitError) && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center">
                {submitError || '필수 항목을 모두 입력해야 제출이 가능합니다.'}
              </div>
            )}
            <CommonButton
              type="submit"
              disabled={!isFormValid || submitting}
              size="fullLg"
              className={isFormValid ? 'rounded-lg' : 'rounded-lg bg-primary/50 hover:bg-primary/50'}
              icon={<span className="material-symbols-outlined">send</span>}
            >
              {submitting ? '지원서 제출 중...' : '온라인 지원서 제출'}
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
