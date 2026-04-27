import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';
import AddressSearchField from '../components/AddressSearchField';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function BusinessSignUpPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: '',
    managerName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    birthDate: '',
    gender: 'MALE',
    businessNumber: '',
    foundedDate: '',
    companyPhone: '',
    address: '',
    detailAddress: '',
    homepageUrl: '',
    companyImageUrl: '',
    image: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!form.companyName.trim()) return '상호명 또는 기업명을 입력해주세요.';
    if (!form.managerName.trim()) return '담당자 이름을 입력해주세요.';
    if (!form.email.trim()) return '이메일을 입력해주세요.';
    if (!form.phone.trim()) return '휴대전화를 입력해주세요.';
    if (!form.password.trim()) return '비밀번호를 입력해주세요.';
    if (form.password.length < 4) return '비밀번호는 4자 이상 입력해주세요.';
    if (!form.passwordConfirm.trim()) return '비밀번호 확인을 입력해주세요.';
    if (form.password !== form.passwordConfirm) return '비밀번호 확인이 일치하지 않습니다.';
    if (!form.birthDate) return '생년월일을 입력해주세요.';
    if (!form.foundedDate) return '설립일을 입력해주세요.';
    if (!form.businessNumber.trim()) return '사업자등록번호를 입력해주세요.';
    if (!form.companyPhone.trim()) return '회사 전화번호를 입력해주세요.';
    if (!form.address.trim()) return '사업장 주소를 입력해주세요.';
    if (!form.detailAddress.trim()) return '상세 주소를 입력해주세요.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const companyAddress = [form.address, form.detailAddress].filter(Boolean).join(' ').trim();

    const payload = {
      name: form.managerName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      birthDate: form.birthDate,
      gender: form.gender,
      memberType: 'BUSINESS',
      image: form.image || null,
      ratingSum: 0,
      ratingCount: 0,
      businessProfile: {
        companyName: form.companyName,
        foundedDate: form.foundedDate,
        companyImageUrl: form.companyImageUrl || null,
        businessNumber: form.businessNumber,
        companyPhone: form.companyPhone,
        companyAddress,
        homepageUrl: form.homepageUrl || null,
      },
    };

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || result?.message || '사업자회원 가입에 실패했습니다.');
      }

      setSuccess('사업자회원 가입이 완료되었습니다.');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
        <TopNavBar />
        <main className="pt-32 pb-16 min-h-screen bg-[#FAF9F6]">
          <section className="max-w-xl mx-auto px-6">
            <div className="bg-white border border-outline rounded-2xl p-8 md:p-10">
              <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">Account</p>
              <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2">사업자회원 가입</h1>
              <p className="text-on-surface-variant text-sm mb-8">
                기업 또는 점주 정보를 등록하고 채용을 시작해보세요.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-8 p-1 rounded-2xl bg-[#F8F9FA] border border-outline">
                <button
                    type="button"
                    onClick={() => navigate('/signup/personal')}
                    className="px-4 py-3 rounded-xl text-on-surface-variant font-bold text-sm hover:bg-white transition-colors"
                >
                  개인회원
                </button>
                <button
                    type="button"
                    className="px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm"
                >
                  사업자회원
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    상호명 / 기업명 <span className="text-red-500">*</span>
                  </label>
                  <input
                      name="companyName"
                      type="text"
                      value={form.companyName}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                      placeholder="예: GS25 마포당인점"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    담당자 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                      name="managerName"
                      type="text"
                      value={form.managerName}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                      placeholder="담당자 이름을 입력하세요"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    이메일 (아이디) <span className="text-red-500">*</span>
                  </label>
                  <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                      placeholder="example@company.com"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    휴대전화 <span className="text-red-500">*</span>
                  </label>
                  <input
                      name="phone"
                      type="text"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                      placeholder="010-1234-5678"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    비밀번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                      placeholder="비밀번호를 입력하세요"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    비밀번호 확인 <span className="text-red-500">*</span>
                  </label>
                  <input
                      name="passwordConfirm"
                      type="password"
                      value={form.passwordConfirm}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                      placeholder="비밀번호를 다시 입력하세요"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    생년월일 <span className="text-red-500">*</span>
                  </label>
                  <input
                      name="birthDate"
                      type="date"
                      value={form.birthDate}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    성별 <span className="text-red-500">*</span>
                  </label>
                  <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    사업자등록번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                      name="businessNumber"
                      type="text"
                      value={form.businessNumber}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                      placeholder="예: 123-45-67890"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    설립일 <span className="text-red-500">*</span>
                  </label>
                  <input
                      name="foundedDate"
                      type="date"
                      value={form.foundedDate}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    회사 전화번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                      name="companyPhone"
                      type="text"
                      value={form.companyPhone}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                      placeholder="예: 02-1234-5678"
                  />
                </div>

                <AddressSearchField
                  label="사업장 주소"
                  addressName="address"
                  detailName="detailAddress"
                  addressValue={form.address}
                  detailValue={form.detailAddress}
                  onChange={handleChange}
                  onAddressSelect={({ address }) => {
                    setForm((prev) => ({
                      ...prev,
                      address: address || '',
                    }));
                  }}
                  required
                  addressPlaceholder="주소 검색 버튼을 눌러주세요"
                  detailPlaceholder="상세 주소를 입력하세요"
                />

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    홈페이지 URL <span className="text-on-surface-variant/70">(선택)</span>
                  </label>
                  <input
                      name="homepageUrl"
                      type="text"
                      value={form.homepageUrl}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                      placeholder="선택 입력"
                  />
                </div>

                {error && (
                    <div className="text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      {error}
                    </div>
                )}

                {success && (
                    <div className="text-sm text-green-700 font-medium bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      {success}
                    </div>
                )}

                <CommonButton size="full" type="submit" disabled={loading}>
                  {loading ? '가입 중...' : '사업자회원 가입'}
                </CommonButton>
              </form>

              <CommonButton
                  type="button"
                  variant="subtle"
                  size="full"
                  className="mt-3"
                  onClick={() => navigate('/login')}
              >
                로그인으로 돌아가기
              </CommonButton>
            </div>
          </section>
        </main>
        <AppFooter />
      </>
  );
}