import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBarLoggedIn from '../components/TopNavBarLoggedIn';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import AddressSearchField from '../components/AddressSearchField';
import BrandModal from '../components/BrandModal';
import {
  getMyBusinessAccountSummary,
  getMyBusinessAccountMe,
  updateMyBusinessCompanyAccount,
  updateMyBusinessMemberAccount,
  updateMyBusinessPasswordAccount,
} from '../services/accountApi';
import { uploadCompanyLogo } from '../services/fileApi';
import BusinessSidebar from '../components/business-mypage/BusinessSidebar';

function normalizeRegionText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

const SIDO_ALIAS_TO_CANONICAL = {
  '서울': '서울특별시',
  '서울시': '서울특별시',
  '부산': '부산광역시',
  '부산시': '부산광역시',
  '대구': '대구광역시',
  '대구시': '대구광역시',
  '인천': '인천광역시',
  '인천시': '인천광역시',
  '광주': '광주광역시',
  '광주시': '광주광역시',
  '대전': '대전광역시',
  '대전시': '대전광역시',
  '울산': '울산광역시',
  '울산시': '울산광역시',
  '세종': '세종특별자치시',
  '세종시': '세종특별자치시',
  '경기': '경기도',
  '강원': '강원특별자치도',
  '강원도': '강원특별자치도',
  '충북': '충청북도',
  '충남': '충청남도',
  '전북': '전북특별자치도',
  '전라북도': '전북특별자치도',
  '전남': '전라남도',
  '경북': '경상북도',
  '경남': '경상남도',
  '제주': '제주특별자치도',
  '제주도': '제주특별자치도',
};

function normalizeSidoName(value) {
  const normalized = normalizeRegionText(value);
  return SIDO_ALIAS_TO_CANONICAL[normalized] || normalized;
}

function extractAddressTokens(address = '') {
  const normalizedAddress = normalizeRegionText(address).replace(/\([^)]*\)/g, '').trim();
  if (!normalizedAddress) {
    return { parsedSido: '', parsedSigungu: '' };
  }

  const tokens = normalizedAddress.split(' ').filter(Boolean);
  const parsedSido = tokens[0] || '';

  let parsedSigungu = tokens[1] || '';
  if (tokens.length >= 3 && /[시군]$/u.test(tokens[1]) && /구$/u.test(tokens[2])) {
    parsedSigungu = `${tokens[1]} ${tokens[2]}`;
  }

  return { parsedSido, parsedSigungu };
}

function extractAddressDetailFromBaseAddress(address = '') {
  const normalizedAddress = normalizeRegionText(address);
  if (!normalizedAddress) return '';

  const { parsedSido, parsedSigungu } = extractAddressTokens(normalizedAddress);
  if (!parsedSido) return normalizedAddress;

  const tokens = normalizedAddress.split(' ').filter(Boolean);
  const sigunguTokenCount = normalizeRegionText(parsedSigungu).split(' ').filter(Boolean).length;
  const startIndex = Math.min(tokens.length, 1 + sigunguTokenCount);
  return tokens.slice(startIndex).join(' ').trim();
}

function buildMemberDetailAddress(baseAddress = '', detailAddress = '') {
  const baseDetail = extractAddressDetailFromBaseAddress(baseAddress);
  const userDetail = normalizeRegionText(detailAddress);

  return [baseDetail, userDetail].filter(Boolean).join(' ').trim();
}

function splitAddressForDisplay(address = '') {
  const normalizedAddress = normalizeRegionText(address);
  if (!normalizedAddress) {
    return { baseAddress: '', detailAddress: '' };
  }

  const { parsedSido, parsedSigungu } = extractAddressTokens(normalizedAddress);
  if (!parsedSido) {
    return { baseAddress: normalizedAddress, detailAddress: '' };
  }

  const tokens = normalizedAddress.split(' ').filter(Boolean);
  const sigunguTokenCount = normalizeRegionText(parsedSigungu).split(' ').filter(Boolean).length;
  const baseTokenCount = Math.min(tokens.length, 1 + sigunguTokenCount);

  return {
    baseAddress: tokens.slice(0, baseTokenCount).join(' ').trim(),
    detailAddress: tokens.slice(baseTokenCount).join(' ').trim(),
  };
}

function trimLeadingOverlapWords(baseAddress = '', detailAddress = '') {
  const normalizedBase = normalizeRegionText(baseAddress);
  const normalizedDetail = normalizeRegionText(detailAddress);
  if (!normalizedBase || !normalizedDetail) return normalizedDetail;

  const baseTokens = normalizedBase.split(' ').filter(Boolean);
  const detailTokens = normalizedDetail.split(' ').filter(Boolean);
  const maxOverlap = Math.min(baseTokens.length, detailTokens.length);

  for (let overlap = maxOverlap; overlap >= 1; overlap -= 1) {
    const baseSuffix = baseTokens.slice(baseTokens.length - overlap).join(' ');
    const detailPrefix = detailTokens.slice(0, overlap).join(' ');

    if (baseSuffix === detailPrefix) {
      return detailTokens.slice(overlap).join(' ').trim();
    }
  }

  return normalizedDetail;
}

function BusinessCompanyEditPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: '',
    businessNumber: '',
    foundedDate: '',
    companyPhone: '',
    homepageUrl: '',
    address: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    sido: '',
    sigungu: '',
  });
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [memberDetailAddress, setMemberDetailAddress] = useState('');
  const [isCompanySaving, setIsCompanySaving] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isMemberSaving, setIsMemberSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    originalPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [sidebarCompanySummary, setSidebarCompanySummary] = useState({
    companyName: '',
    businessNumber: '',
    companyImageUrl: '',
    brandId: null,
    brandLogoUrl: '',
  });
  const [draftCompanyImageUrl, setDraftCompanyImageUrl] = useState('');
  const [companyAddressBase, setCompanyAddressBase] = useState('');
  const [companyAddressDetail, setCompanyAddressDetail] = useState('');
  const [memberAddressBase, setMemberAddressBase] = useState('');
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedBrandName, setSelectedBrandName] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchSigunguOptionsBySido = async (sido) => {
    const normalizedSido = normalizeSidoName(sido);
    if (!normalizedSido) return [];

    const res = await fetch(`/api/brand/regionFilter/${encodeURIComponent(normalizedSido)}`);
    if (!res.ok) return [];

    const data = await res.json();
    const map = new Map();

    (data || []).forEach((region) => {
      if (!region?.sigungu || map.has(region.sigungu)) return;
      map.set(region.sigungu, {
        id: region.id,
        sido: region.sido,
        sigungu: region.sigungu,
      });
    });

    return Array.from(map.values());
  };

  const resolveBrandLogoUrl = async (brandId) => {
    if (brandId == null) return '';
    try {
      const response = await fetch(`/api/brand/${encodeURIComponent(brandId)}/summary`);
      if (!response.ok) return '';
      const result = await response.json();
      return result?.logoImg || '';
    } catch {
      return '';
    }
  };

  const handleCompanyAddressSelect = ({ address }) => {
    const nextBaseAddress = normalizeRegionText(address);
    setCompanyAddressBase(nextBaseAddress);
    setCompanyAddressDetail('');
  };

  const handleMemberAddressSelect = async ({ address, sido, sigungu }) => {
    const nextAddress = normalizeRegionText(address);
    setMemberAddressBase(nextAddress);
    setMemberDetailAddress('');

    const { parsedSido, parsedSigungu } = extractAddressTokens(nextAddress);
    const normalizedSido = normalizeSidoName(sido || parsedSido);
    const normalizedSigungu = normalizeRegionText(sigungu || parsedSigungu);

    if (!normalizedSido) {
      setForm((prev) => ({ ...prev, sido: '', sigungu: '' }));
      setSelectedRegionId(null);
      return;
    }

    try {
      const options = await fetchSigunguOptionsBySido(normalizedSido);
      const selected = options.find((opt) => normalizeRegionText(opt?.sigungu) === normalizedSigungu)
        || options.find((opt) => {
          const optionSigungu = normalizeRegionText(opt?.sigungu);
          if (!normalizedSigungu) return false;
          return optionSigungu.startsWith(normalizedSigungu) || normalizedSigungu.startsWith(optionSigungu);
        });

      setForm((prev) => ({
        ...prev,
        sido: selected?.sido || normalizedSido,
        sigungu: selected?.sigungu || normalizedSigungu,
      }));
      setSelectedRegionId(selected?.id || null);
    } catch {
      setSelectedRegionId(null);
      setForm((prev) => ({ ...prev, sido: normalizedSido, sigungu: normalizedSigungu }));
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLogoUploading(true);
      const oldUrl = draftCompanyImageUrl || '';
      const uploaded = await uploadCompanyLogo(file, oldUrl || undefined);
      const nextLogoUrl = uploaded?.url || '';

      if (!nextLogoUrl) {
        throw new Error('로고 업로드 결과 URL이 없습니다.');
      }

      setDraftCompanyImageUrl(nextLogoUrl);
      window.alert('로고 이미지가 업로드되었습니다. 저장 버튼을 누르면 반영됩니다.');
    } catch (error) {
      window.alert(error?.message || '로고 업로드에 실패했습니다.');
    } finally {
      setIsLogoUploading(false);
      event.target.value = '';
    }
  };

  const handleLogoRemove = () => {
    if (!draftCompanyImageUrl) return;
    const ok = window.confirm('현재 기업 로고를 삭제하시겠어요? 저장 버튼을 눌러야 최종 반영됩니다.');
    if (!ok) return;

    setDraftCompanyImageUrl('');
  };

  const handleSaveMemberInfo = async () => {
    if (!memberAddressBase.trim()) {
      window.alert('담당자 주소를 검색해주세요.');
      return;
    }

    if (!selectedRegionId) {
      window.alert('담당자 주소에서 지역을 확인할 수 없습니다. 주소를 다시 선택해주세요.');
      return;
    }

    const mergedMemberDetailAddress = buildMemberDetailAddress(memberAddressBase, memberDetailAddress);

    if (!mergedMemberDetailAddress) {
      window.alert('상세주소를 입력해주세요.');
      return;
    }

    try {
      setIsMemberSaving(true);

      await updateMyBusinessMemberAccount({
        name: form.contactName,
        phone: form.contactPhone,
        regionId: selectedRegionId,
        detailAddress: mergedMemberDetailAddress,
      });

      window.alert('담당자 정보가 저장되었습니다.');
    } catch (error) {
      window.alert(error?.message || '담당자 정보 저장에 실패했습니다.');
    } finally {
      setIsMemberSaving(false);
    }
  };

  const handleSaveCompanyInfo = async () => {
    if (!form.companyName || !form.companyName.trim()) {
      window.alert('기업명을 입력해주세요.');
      return;
    }

    if (!form.businessNumber || !form.businessNumber.trim()) {
      window.alert('사업자 번호를 입력해주세요.');
      return;
    }

    if (!form.foundedDate) {
      window.alert('설립일을 입력해주세요.');
      return;
    }

    if (!form.companyPhone || !form.companyPhone.trim()) {
      window.alert('회사 번호를 입력해주세요.');
      return;
    }

    const mergedCompanyAddress = [companyAddressBase, companyAddressDetail]
      .map((value) => String(value || '').trim())
      .filter(Boolean)
      .join(' ');

    if (!mergedCompanyAddress) {
      window.alert('사업장 주소를 입력해주세요.');
      return;
    }

    try {
      setIsCompanySaving(true);

      await updateMyBusinessCompanyAccount({
        foundedDate: form.foundedDate,
        companyName: form.companyName.trim(),
        businessNumber: form.businessNumber.trim(),
        companyPhone: form.companyPhone.trim(),
        homepageUrl: form.homepageUrl ? form.homepageUrl.trim() : '',
        companyAddress: mergedCompanyAddress,
        companyImageUrl: draftCompanyImageUrl || '',
        // 백엔드 DTO에 brandId 필드가 추가되면 함께 저장됩니다.
        brandId: selectedBrandId,
      });

      setSidebarCompanySummary({
        companyName: form.companyName.trim(),
        businessNumber: form.businessNumber.trim(),
        companyImageUrl: draftCompanyImageUrl || '',
            brandId: selectedBrandId,
            brandLogoUrl: sidebarCompanySummary?.brandLogoUrl || '',
      });

      if (draftCompanyImageUrl) {
        localStorage.setItem('businessCompanyLogoUrl', draftCompanyImageUrl);
      } else {
        localStorage.removeItem('businessCompanyLogoUrl');
      }

      window.alert('기본 정보가 저장되었습니다.');
    } catch (error) {
      window.alert(error?.message || '기본 정보 저장에 실패했습니다.');
    } finally {
      setIsCompanySaving(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (!passwordForm.originalPassword || !passwordForm.newPassword || !passwordForm.newPasswordConfirm) {
      window.alert('모든 비밀번호 항목을 입력해주세요.');
      return;
    }

    if (passwordForm.newPassword.length < 4) {
      window.alert('새 비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.newPasswordConfirm) {
      window.alert('새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      setIsPasswordSaving(true);

      await updateMyBusinessPasswordAccount({
        originalPassword: passwordForm.originalPassword,
        newPassword: passwordForm.newPassword,
        newPasswordConfirm: passwordForm.newPasswordConfirm,
      });

      setPasswordForm({
        originalPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      });
      window.alert('비밀번호가 변경되었습니다.');
    } catch (error) {
      window.alert(error?.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsPasswordSaving(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchMyBusinessAccount = async () => {
      try {
        const [data, summary] = await Promise.all([
          getMyBusinessAccountMe(),
          getMyBusinessAccountSummary(),
        ]);
        const brandLogoUrl = await resolveBrandLogoUrl(data?.brandId);
        const brandName = data?.brandName || '';
        const regionName = normalizeRegionText(data?.regionName);
        const { parsedSido, parsedSigungu } = extractAddressTokens(regionName);
        const normalizedSido = normalizeSidoName(parsedSido);
        const normalizedSigungu = normalizeRegionText(parsedSigungu);
        const {
          baseAddress: companyBaseAddress,
          detailAddress: companyDetailAddress,
        } = splitAddressForDisplay(data?.companyAddress);
        const memberDetailDisplayValue = trimLeadingOverlapWords(regionName, data?.detailAddress);

        let options = [];
        if (normalizedSido) {
          options = await fetchSigunguOptionsBySido(normalizedSido);
        }

        const selected = options.find((opt) => normalizeRegionText(opt?.sigungu) === normalizedSigungu)
          || options.find((opt) => {
            const optionSigungu = normalizeRegionText(opt?.sigungu);
            if (!normalizedSigungu) return false;
            return optionSigungu.startsWith(normalizedSigungu) || normalizedSigungu.startsWith(optionSigungu);
          });

        if (mounted) {
          setForm((prev) => ({
            ...prev,
            companyName: data?.companyName || prev.companyName,
            businessNumber: data?.businessNumber || prev.businessNumber,
            foundedDate: data?.foundedDate || prev.foundedDate,
            companyPhone: data?.companyPhone || prev.companyPhone,
            homepageUrl: data?.homepageUrl || prev.homepageUrl,
            address: data?.companyAddress || prev.address,
            contactName: data?.name || prev.contactName,
            contactPhone: data?.phone || prev.contactPhone,
            contactEmail: data?.email || prev.contactEmail,
            sido: selected?.sido || normalizedSido || prev.sido,
            sigungu: selected?.sigungu || normalizedSigungu || prev.sigungu,
          }));
          setMemberAddressBase(regionName || '');
          setMemberDetailAddress(memberDetailDisplayValue || '');
          setCompanyAddressBase(companyBaseAddress || '');
          setCompanyAddressDetail(companyDetailAddress || '');
          setSelectedRegionId(selected?.id || null);
          setSidebarCompanySummary({
            companyName: summary?.companyName || data?.companyName || '',
            businessNumber: summary?.businessNumber || data?.businessNumber || '',
            companyImageUrl: summary?.companyImageUrl || data?.companyImageUrl || localStorage.getItem('businessCompanyLogoUrl') || '',
            brandId: data?.brandId ?? null,
            brandLogoUrl,
          });
          setDraftCompanyImageUrl(summary?.companyImageUrl || data?.companyImageUrl || localStorage.getItem('businessCompanyLogoUrl') || '');
          setSelectedBrandId(data?.brandId ?? null);
          setSelectedBrandName(brandName);
        }
      } catch {
        // API 실패 시 빈 값 상태를 유지합니다.
      }
    };

    fetchMyBusinessAccount();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-on-surface">
      <TopNavBarLoggedIn />

      <div className="pt-20 min-h-screen">
        <div className="custom-container py-8 flex flex-col lg:flex-row gap-8">
          <BusinessSidebar
            activeTab=""
            onChangeTab={(tabId) => navigate(`/dashboard?tab=${tabId}`)}
            navigate={navigate}
            companySummary={sidebarCompanySummary}
          />

          <main className="flex-1 min-w-0">
            <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-3xl font-black tracking-tight">기업 정보 수정</h1>
                <p className="text-sm text-on-surface-variant mt-1">사업자 정보와 운영 정보를 최신 상태로 유지해주세요.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard?tab=dashboard')}
                className="self-start md:self-auto px-4 py-2 rounded-lg border border-outline bg-white text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                대시보드로 돌아가기
              </button>
            </header>

            <form className="space-y-6">
              <section className="bg-white border border-outline rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">기본 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="기업명" name="companyName" value={form.companyName} onChange={handleChange} />
                  <Field label="사업자번호" name="businessNumber" value={form.businessNumber} onChange={handleChange} />
                  <Field label="설립일" name="foundedDate" value={form.foundedDate} onChange={handleChange} type="date" />
                  <Field label="회사 번호" name="companyPhone" value={form.companyPhone} onChange={handleChange} />
                  <Field label="회사 홈페이지 URL" name="homepageUrl" value={form.homepageUrl} onChange={handleChange} />
                  <div>
                    <span className="text-xs font-bold text-on-surface-variant mb-2 block">브랜드</span>
                    <button
                      type="button"
                      onClick={() => setIsBrandModalOpen(true)}
                      className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className={selectedBrandId ? 'text-on-surface' : 'text-on-surface-variant'}>
                        {selectedBrandId ? `${selectedBrandName || '선택된 브랜드'} (ID: ${selectedBrandId})` : '브랜드 선택(선택사항)'}
                      </span>
                      <span className="material-symbols-outlined text-[18px]">storefront</span>
                    </button>
                  </div>
                  <div className="md:col-span-2">
                    <AddressSearchField
                      label="사업장 주소"
                      addressName="companyAddressBase"
                      detailName="companyAddressDetail"
                      addressValue={companyAddressBase}
                      detailValue={companyAddressDetail}
                      onChange={(event) => {
                        if (event.target.name === 'companyAddressDetail') {
                          setCompanyAddressDetail(event.target.value);
                        }
                      }}
                      onAddressSelect={handleCompanyAddressSelect}
                      required
                      addressPlaceholder="주소 검색 버튼을 눌러 사업장 주소를 선택하세요"
                      detailPlaceholder="상세 주소를 입력하세요"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block">
                      <span className="text-xs font-bold text-on-surface-variant mb-2 block">기업 로고</span>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl border border-outline bg-surface-container-low overflow-hidden flex items-center justify-center">
                          {draftCompanyImageUrl ? (
                            <img src={draftCompanyImageUrl} alt="기업 로고" className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-on-surface-variant">apartment</span>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            disabled={isLogoUploading || isCompanySaving}
                            className="block w-full rounded-xl border border-outline bg-white px-3 py-2 text-sm"
                          />
                          <button
                            type="button"
                            onClick={handleLogoRemove}
                            disabled={!draftCompanyImageUrl || isLogoUploading || isCompanySaving}
                            className="rounded-xl border border-outline px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            로고 삭제
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-on-surface-variant">
                        로고를 삭제한 뒤 <span className="font-bold">저장</span>을 눌러야 실제 반영됩니다.
                      </p>
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <CommonButton
                    type="button"
                    size="sm"
                    onClick={handleSaveCompanyInfo}
                    disabled={isCompanySaving}
                  >
                    {isCompanySaving ? '저장 중...' : '저장'}
                  </CommonButton>
                </div>
              </section>

              <section className="bg-white border border-outline rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">담당자 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="담당자명" name="contactName" value={form.contactName} onChange={handleChange} />
                  <Field label="연락처" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
                  <Field label="이메일" name="contactEmail" value={form.contactEmail} onChange={handleChange} disabled />
                  <div className="md:col-span-2">
                    <AddressSearchField
                      label="담당자 주소"
                      addressName="memberAddressBase"
                      detailName="memberDetailAddress"
                      addressValue={memberAddressBase}
                      detailValue={memberDetailAddress}
                      onChange={(event) => {
                        if (event.target.name === 'memberDetailAddress') {
                          setMemberDetailAddress(event.target.value);
                        }
                      }}
                      onAddressSelect={handleMemberAddressSelect}
                      required
                      addressPlaceholder="주소 검색 버튼을 눌러 담당자 주소를 선택하세요"
                      detailPlaceholder="상세 주소를 입력하세요"
                    />
                    <p className="mt-2 text-xs text-on-surface-variant">
                      자동 인식 지역: {form.sido || '-'} {form.sigungu || '-'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <CommonButton
                    type="button"
                    size="sm"
                    onClick={handleSaveMemberInfo}
                    disabled={isMemberSaving}
                  >
                    {isMemberSaving ? '저장 중...' : '저장'}
                  </CommonButton>
                </div>
              </section>

              <section className="bg-white border border-outline rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">비밀번호 변경</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field
                    label="기존 비밀번호"
                    name="originalPassword"
                    value={passwordForm.originalPassword}
                    onChange={handlePasswordChange}
                    type="password"
                  />
                  <Field
                    label="새 비밀번호"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    type="password"
                  />
                  <Field
                    label="새 비밀번호 확인"
                    name="newPasswordConfirm"
                    value={passwordForm.newPasswordConfirm}
                    onChange={handlePasswordChange}
                    type="password"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <CommonButton
                    type="button"
                    size="sm"
                    onClick={handleChangePassword}
                    disabled={isPasswordSaving}
                  >
                    {isPasswordSaving ? '변경 중...' : '변경'}
                  </CommonButton>
                </div>
              </section>

            </form>
          </main>
        </div>
      </div>
      <AppFooter />

      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSelectBrand={async ({ brandId, brandName }) => {
          const brandLogoUrl = await resolveBrandLogoUrl(brandId);
          setSelectedBrandId(brandId);
          setSelectedBrandName(brandName || '');
          setSidebarCompanySummary((prev) => ({ ...prev, brandId, brandLogoUrl }));
        }}
      />
    </div>
  );
}

function Field({ label, name, value, onChange, disabled = false, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-on-surface-variant mb-2 block">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none disabled:bg-gray-100 disabled:text-on-surface-variant disabled:cursor-not-allowed"
      />
    </label>
  );
}


export default BusinessCompanyEditPage;

