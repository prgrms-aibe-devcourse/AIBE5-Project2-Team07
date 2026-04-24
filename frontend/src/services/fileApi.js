const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function uploadPersonalResumeFile(file) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/api/files/upload/resume/personal`, {
    method: 'POST',
    headers,
    body: formData,
  });

  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.error || result?.message || '파일 업로드 중 오류가 발생했습니다.');
  }

  return result;
}


