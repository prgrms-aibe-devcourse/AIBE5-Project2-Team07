import { requestWithAuth } from './authApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function getMyResume() {
    return requestWithAuth(`${API_BASE}/personal/resume`, 'GET');
}

export async function createResume(payload) {
    return requestWithAuth(`${API_BASE}/personal/resume`, 'POST', payload);
}

export async function updateResume(payload) {
    return requestWithAuth(`${API_BASE}/personal/resume`, 'PATCH', payload);
}

export async function deleteResume() {
    return requestWithAuth(`${API_BASE}/personal/resume`, 'DELETE');
}

export async function createCareer(payload) {
    return requestWithAuth(`${API_BASE}/personal/career`, 'POST', payload);
}

export async function updateCareer(id, payload) {
    return requestWithAuth(`${API_BASE}/personal/career/${id}`, 'PUT', payload);
}

export async function deleteCareer(id) {
    return requestWithAuth(`${API_BASE}/personal/career/${id}`, 'DELETE');
}

export async function createEducation(payload) {
    return requestWithAuth(`${API_BASE}/personal/education`, 'POST', payload);
}

export async function updateEducation(id, payload) {
    return requestWithAuth(`${API_BASE}/personal/education/${id}`, 'PUT', payload);
}

export async function deleteEducation(id) {
    return requestWithAuth(`${API_BASE}/personal/education/${id}`, 'DELETE');
}

export async function createLicense(payload) {
    return requestWithAuth(`${API_BASE}/personal/license`, 'POST', payload);
}

export async function updateLicense(id, payload) {
    return requestWithAuth(`${API_BASE}/personal/license/${id}`, 'PUT', payload);
}

export async function deleteLicense(id) {
    return requestWithAuth(`${API_BASE}/personal/license/${id}`, 'DELETE');
}