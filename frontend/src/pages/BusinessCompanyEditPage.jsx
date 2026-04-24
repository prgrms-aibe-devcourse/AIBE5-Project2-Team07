import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBarLoggedIn from '../components/TopNavBarLoggedIn';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import {
  getMyBusinessAccountMe,
  updateMyBusinessCompanyAccount,
  updateMyBusinessMemberAccount,
  updateMyBusinessPasswordAccount,
} from '../services/accountApi';
import BusinessSidebar from '../components/business-mypage/BusinessSidebar';

const sidoOptions = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시',
  '세종특별자치시', '경기도', '강원특별자치도', '충청북도', '충청남도', '전북특별자치도', '전라남도',
  '경상북도', '경상남도', '제주특별자치도',
];

function BusinessCompanyEditPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: '하드코딩',
    businessNumber: '하드코딩',
    foundedDate: '',
    companyPhone: '하드코딩',
    address: '하드코딩',
    contactName: '하드코딩',
    contactPhone: '하드코딩',
    contactEmail: '하드코딩',
    sido: '',
    sigungu: '',
  });
  const [sigunguOptions, setSigunguOptions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [memberDetailAddress, setMemberDetailAddress] = useState('하드코딩');
  const [isSidoOpen, setIsSidoOpen] = useState(false);
  const [isSigunguOpen, setIsSigunguOpen] = useState(false);
  const [isCompanySaving, setIsCompanySaving] = useState(false);
  const [isMemberSaving, setIsMemberSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    originalPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [sidebarCompanySummary, setSidebarCompanySummary] = useState({
    companyName: '하드코딩',
    businessNumber: '하드코딩',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchSigunguOptionsBySido = async (sido) => {
    const res = await fetch(`/api/brand/regionFilter/${encodeURIComponent(sido)}`);
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

  const handleSelectSido = async (sido) => {
    setForm((prev) => ({ ...prev, sido, sigungu: '' }));
    setSelectedRegionId(null);
    setIsSidoOpen(false);
    setIsSigunguOpen(false);

    try {
      const options = await fetchSigunguOptionsBySido(sido);
      setSigunguOptions(options);
    } catch {
      setSigunguOptions([]);
    }
  };

  const handleSelectSigungu = (sigungu) => {
    const selected = sigunguOptions.find((opt) => opt.sigungu === sigungu);

    setForm((prev) => ({ ...prev, sigungu }));
    setSelectedRegionId(selected?.id || null);
    setIsSigunguOpen(false);
  };

  const handleSaveMemberInfo = async () => {
    if (!selectedRegionId) {
      window.alert('시/도와 시/군/구를 선택해주세요.');
      return;
    }

    if (!memberDetailAddress || !memberDetailAddress.trim()) {
      window.alert('상세주소를 입력해주세요.');
      return;
    }

    try {
      setIsMemberSaving(true);

      await updateMyBusinessMemberAccount({
        name: form.contactName,
        phone: form.contactPhone,
        regionId: selectedRegionId,
        detailAddress: memberDetailAddress.trim(),
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
      window.alert('사업자번호를 입력해주세요.');
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

    if (!form.address || !form.address.trim()) {
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
        companyAddress: form.address.trim(),
      });

      setSidebarCompanySummary({
        companyName: form.companyName.trim(),
        businessNumber: form.businessNumber.trim(),
      });

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
        const data = await getMyBusinessAccountMe();
        const regionName = typeof data?.regionName === 'string' ? data.regionName.trim() : '';
        const [sido = '', ...sigunguParts] = regionName.split(' ');
        const sigungu = sigunguParts.join(' ').trim();

        let options = [];
        if (sido) {
          options = await fetchSigunguOptionsBySido(sido);
        }

        const selected = options.find((opt) => opt.sigungu === sigungu);

        if (mounted) {
          setForm((prev) => ({
            ...prev,
            companyName: data?.companyName || prev.companyName,
            businessNumber: data?.businessNumber || prev.businessNumber,
            foundedDate: data?.foundedDate || prev.foundedDate,
            companyPhone: data?.companyPhone || prev.companyPhone,
            address: data?.companyAddress || prev.address,
            contactName: data?.name || prev.contactName,
            contactPhone: data?.phone || prev.contactPhone,
            contactEmail: data?.email || prev.contactEmail,
            sido: sido || prev.sido,
            sigungu: sigungu || prev.sigungu,
          }));
          setMemberDetailAddress(data?.detailAddress || '하드코딩');
          setSigunguOptions(options);
          setSelectedRegionId(selected?.id || null);
          setSidebarCompanySummary({
            companyName: data?.companyName || '하드코딩',
            businessNumber: data?.businessNumber || '하드코딩',
          });
        }
      } catch {
        // API 실패 시 폼 기본값('하드코딩')을 유지합니다.
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
                  <Field label="사업장 주소" name="address" value={form.address} onChange={handleChange} />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="담당자명" name="contactName" value={form.contactName} onChange={handleChange} />
                  <Field label="연락처" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
                  <Field label="이메일" name="contactEmail" value={form.contactEmail} onChange={handleChange} disabled />
                  <DropdownField
                    label="시/도"
                    value={form.sido}
                    placeholder="시/도를 선택하세요"
                    options={sidoOptions}
                    isOpen={isSidoOpen}
                    onToggle={() => {
                      setIsSidoOpen((prev) => !prev);
                      setIsSigunguOpen(false);
                    }}
                    onSelect={handleSelectSido}
                  />
                  <DropdownField
                    label="시/군/구"
                    value={form.sigungu}
                    placeholder="지역 정보가 없습니다"
                    options={sigunguOptions.length > 0 ? sigunguOptions.map((opt) => opt.sigungu) : ['지역 정보가 없습니다']}
                    isOpen={isSigunguOpen}
                    onToggle={() => {
                      if (sigunguOptions.length === 0) return;
                      setIsSigunguOpen((prev) => !prev);
                      setIsSidoOpen(false);
                    }}
                    onSelect={(value) => {
                      if (value === '지역 정보가 없습니다') return;
                      handleSelectSigungu(value);
                    }}
                    disabled={sigunguOptions.length === 0}
                  />
                  <div className="md:col-span-3">
                    <Field
                      label="상세주소"
                      name="memberDetailAddress"
                      value={memberDetailAddress}
                      onChange={(event) => setMemberDetailAddress(event.target.value)}
                    />
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

function DropdownField({
  label,
  value,
  placeholder,
  options,
  isOpen,
  onToggle,
  onSelect,
  disabled = false,
}) {
  return (
    <div className="relative">
      <span className="text-xs font-bold text-on-surface-variant mb-2 block">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="w-full rounded-xl border border-outline bg-white px-4 py-2.5 text-sm text-left flex items-center justify-between disabled:bg-gray-100 disabled:text-on-surface-variant disabled:cursor-not-allowed"
      >
        <span className={value ? 'text-on-surface' : 'text-on-surface-variant'}>{value || placeholder}</span>
        <span className="material-symbols-outlined text-[18px]">expand_more</span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-outline bg-white shadow-lg max-h-44 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default BusinessCompanyEditPage;

