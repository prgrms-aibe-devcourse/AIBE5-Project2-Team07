import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import AppFooter from '../components/AppFooter';
import CommonButton from '../components/CommonButton';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function PersonalSignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    birthDate: '',
    gender: 'MALE',
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
    if (!form.name.trim()) return '이름을 입력해주세요.';
    if (!form.email.trim()) return '이메일을 입력해주세요.';
    if (!form.phone.trim()) return '휴대전화를 입력해주세요.';
    if (!form.password.trim()) return '비밀번호를 입력해주세요.';
    if (form.password.length < 4) return '비밀번호는 4자 이상 입력해주세요.';
    if (form.password !== form.passwordConfirm) return '비밀번호 확인이 일치하지 않습니다.';
    if (!form.birthDate) return '생년월일을 입력해주세요.';
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

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      birthDate: form.birthDate,
      gender: form.gender,
      memberType: 'INDIVIDUAL',
      image: form.image || null,
      ratingSum: 0,
      ratingCount: 0,
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
        throw new Error(result?.error || result?.message || '회원가입에 실패했습니다.');
      }

      setSuccess('개인회원 가입이 완료되었습니다.');
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
              <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2">개인회원 가입</h1>
              <p className="text-on-surface-variant text-sm mb-8">
                기본 정보를 입력하고 대타 서비스를 시작해보세요.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-8 p-1 rounded-2xl bg-[#F8F9FA] border border-outline">
                <button
                    type="button"
                    className="px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm"
                >
                  개인회원
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/signup/business')}
                    className="px-4 py-3 rounded-xl text-on-surface-variant font-bold text-sm hover:bg-white transition-colors"
                >
                  사업자회원
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    이름
                  </label>
                  <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                      placeholder="이름을 입력하세요"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    이메일
                  </label>
                  <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-white border border-outline rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary"
                      placeholder="example@daeta.com"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide block mb-2">
                    휴대전화
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
                    비밀번호
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
                    비밀번호 확인
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
                    생년월일
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
                    성별
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
                    프로필 이미지 URL
                  </label>
                  <input
                      name="image"
                      type="text"
                      value={form.image}
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
                  {loading ? '가입 중...' : '개인회원 가입'}
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