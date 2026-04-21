import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KakaoOAuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('카카오 로그인 처리 중입니다...');
  const backendBaseUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');

  useEffect(() => {
    let cancelled = false;

    const verifyLogin = async () => {
      try {
        const response = await fetch(`${backendBaseUrl}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('로그인 확인 실패');
        }

        if (!cancelled) {
          setMessage('로그인 성공! 이동 중입니다...');
          navigate('/', { replace: true });
        }
      } catch (error) {
        if (!cancelled) {
          setMessage('로그인 확인에 실패했습니다. 다시 시도해 주세요.');
          navigate('/login', { replace: true });
        }
      }
    };

    verifyLogin();

    return () => {
      cancelled = true;
    };
  }, [backendBaseUrl, navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6">
      <p className="text-sm text-on-surface-variant">{message}</p>
    </main>
  );
}

