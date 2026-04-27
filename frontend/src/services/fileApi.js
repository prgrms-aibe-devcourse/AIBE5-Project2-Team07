import { getAuthHeaders } from './authApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function uploadFile(path, file, extraFields = {}) {
  const formData = new FormData();
  formData.append('file', file);
  Object.entries(extraFields).forEach(([k, v]) => formData.append(k, v));

  const headers = {};
  const authHeaders = getAuthHeaders();
  if (authHeaders.Authorization) headers.Authorization = authHeaders.Authorization;

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formData,
  });
  let result = null;
  try { result = await response.json(); } catch { result = null; }
  if (!response.ok) throw new Error(result?.error || result?.message || '파일 업로드 중 오류가 발생했습니다.');
  return result;
}

export async function uploadPersonalResumeFile(file) {
  return uploadFile('/api/files/upload/resume/personal', file);
}

export async function uploadProfileImage(file, oldUrl) {
  return uploadFile('/api/files/upload/profile', file, oldUrl ? { oldUrl } : {});
}

export async function uploadCompanyLogo(file, oldUrl) {
  return uploadFile('/api/files/upload/logo', file, oldUrl ? { oldUrl } : {});
}

export async function uploadBusinessResumeFile(file) {
  return uploadFile('/api/files/upload/resume/business', file);
}

