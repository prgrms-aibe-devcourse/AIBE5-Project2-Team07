import React, { useMemo, useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import AddressSearchField from '../components/AddressSearchField';

export default function BusinessSignUpPage() {
  const [allAgree, setAllAgree] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessNumber: '',
    companyName: '',
    ceoName: '',
    foundedDate: '',
    companyPostalCode: '',
    companyAddress: '',
    companyAddressDetail: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllAgree = (checked) => {
    setAllAgree(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
  };

  const handleAgreeTerms = (checked) => {
    setAgreeTerms(checked);
    setAllAgree(checked && agreePrivacy);
  };

  const handleAgreePrivacy = (checked) => {
    setAgreePrivacy(checked);
    setAllAgree(checked && agreeTerms);
  };

  const handleCompanyAddressSelect = ({ zonecode, address }) => {
    setForm((prev) => ({
      ...prev,
      companyPostalCode: zonecode,
      companyAddress: address,
      companyAddressDetail: '',
    }));
  };

  const isFormValid = useMemo(() => {
    const filled = Object.values(form).every((value) => value.trim() !== '');
    return filled && agreeTerms && agreePrivacy && form.password === form.confirmPassword;
  }, [form, agreeTerms, agreePrivacy]);

  return (
    <>
      <TopNavBar />
      <main className="pt-32 pb-24 bg-[#FDFCFB] min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-primary font-bold tracking-widest text-sm mb-4">BUSINESS JOIN</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface leading-tight">
              새로운 대타 파트너를
              <br />
              환영합니다
            </h1>
            <p className="mt-4 text-on-surface-variant text-lg">
              사업자 정보를 입력하고 긴급 매칭 서비스의 모든 기능을 시작하세요.
            </p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <section className="bg-surface rounded-2xl p-8 md:p-10 shadow-sm border border-outline">
              <h2 className="text-xl font-extrabold mb-8 tracking-tight">약관 동의</h2>
              <div className="space-y-6">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-6 h-6 border-outline rounded text-primary focus:ring-primary"
                    checked={allAgree}
                    onChange={(e) => handleAllAgree(e.target.checked)}
                  />
                  <span className="text-lg font-bold">전체 동의하기</span>
                </label>
                <div className="h-[1px] bg-outline w-full"></div>
                <div className="space-y-5">
                  <label className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        className="w-5 h-5 border-outline rounded text-primary focus:ring-primary"
                        checked={agreeTerms}
                        onChange={(e) => handleAgreeTerms(e.target.checked)}
                      />
                      <span className="text-on-surface-variant font-medium">이용약관 동의 (필수)</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">chevron_right</span>
                  </label>
                  <label className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        className="w-5 h-5 border-outline rounded text-primary focus:ring-primary"
                        checked={agreePrivacy}
                        onChange={(e) => handleAgreePrivacy(e.target.checked)}
                      />
                      <span className="text-on-surface-variant font-medium">개인정보 수집 및 이용 동의 (필수)</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">chevron_right</span>
                  </label>
                </div>
              </div>
            </section>

            <section className="bg-surface rounded-2xl p-8 md:p-10 shadow-sm border border-outline">
              <h2 className="text-xl font-extrabold mb-10 tracking-tight">사업자 정보</h2>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 pb-8 border-b border-outline mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">아이디</label>
                    <input name="username" value={form.username} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="ID를 입력하세요" type="text" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">이메일</label>
                    <input name="email" value={form.email} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="example@daeta.com" type="email" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">비밀번호</label>
                    <input name="password" value={form.password} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="••••••••" type="password" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">비밀번호 확인</label>
                    <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="••••••••" type="password" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">사업자등록번호</label>
                    <div className="flex gap-3">
                      <input name="businessNumber" value={form.businessNumber} onChange={handleChange} className="flex-1 bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="000-00-00000" type="text" />
                      <button className="text-primary font-bold text-sm whitespace-nowrap px-2" type="button">조회하기</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">회사명</label>
                    <input name="companyName" value={form.companyName} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="상호명을 입력하세요" type="text" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">대표자명</label>
                    <input name="ceoName" value={form.ceoName} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base placeholder:text-on-surface-variant/40 focus:bg-white transition-colors" placeholder="성함을 입력하세요" type="text" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">설립일</label>
                    <input name="foundedDate" value={form.foundedDate} onChange={handleChange} className="w-full bg-background border border-outline rounded-xl py-3.5 px-4 text-base appearance-none focus:bg-white transition-colors" type="date" />
                  </div>
                </div>

                <AddressSearchField
                  label="회사 주소"
                  addressName="companyAddress"
                  detailName="companyAddressDetail"
                  addressValue={form.companyAddress}
                  detailValue={form.companyAddressDetail}
                  onChange={handleChange}
                  onAddressSelect={handleCompanyAddressSelect}
                  required
                  className="flex flex-col gap-3"
                  addressPlaceholder="주소 검색 버튼을 눌러 회사 주소를 선택하세요"
                  detailPlaceholder="상세 주소를 입력하세요"
                />
              </div>
            </section>

            <div className="pt-8 flex flex-col gap-6">
              <CommonButton
                type="submit"
                disabled={!isFormValid}
                size="fullLg"
                variant={isFormValid ? 'primary' : 'subtle'}
                className={isFormValid ? '' : 'bg-gray-300 text-gray-500 hover:bg-gray-300'}
                icon={<span className="material-symbols-outlined">arrow_forward</span>}
              >
                가입 완료
              </CommonButton>
              <p className="text-center text-on-surface-variant text-sm">
                가입 시 대타의 <a className="underline font-bold text-on-surface" href="#">개인정보 처리방침</a>에 동의하게 됩니다.
              </p>
            </div>
          </form>
        </div>
      </main>
      <AppFooter />
    </>
  );
}
