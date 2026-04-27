import { requestWithAuth } from './authApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function getMyResume() {
    return requestWithAuth(`${API_BASE}/personal/resume`, {
        method: 'GET',
    });
}

export async function createResume(payload) {
    return requestWithAuth(`${API_BASE}/personal/resume`, {
        method: 'POST',
        body: payload,
    });
}

export async function updateResume(payload) {
    return requestWithAuth(`${API_BASE}/personal/resume`, {
        method: 'PATCH',
        body: payload,
    });
}

export async function deleteResume() {
    return requestWithAuth(`${API_BASE}/personal/resume`, {
        method: 'DELETE',
    });
}

export async function createCareer(payload) {
    return requestWithAuth(`${API_BASE}/personal/career`, {
        method: 'POST',
        body: payload,
    });
}

export async function updateCareer(id, payload) {
    return requestWithAuth(`${API_BASE}/personal/career/${id}`, {
        method: 'PUT',
        body: payload,
    });
}

export async function deleteCareer(id) {
    return requestWithAuth(`${API_BASE}/personal/career/${id}`, {
        method: 'DELETE',
    });
}

export async function createEducation(payload) {
    return requestWithAuth(`${API_BASE}/personal/education`, {
        method: 'POST',
        body: payload,
    });
}

export async function updateEducation(id, payload) {
    return requestWithAuth(`${API_BASE}/personal/education/${id}`, {
        method: 'PUT',
        body: payload,
    });
}

export async function deleteEducation(id) {
    return requestWithAuth(`${API_BASE}/personal/education/${id}`, {
        method: 'DELETE',
    });
}

export async function createLicense(payload) {
    return requestWithAuth(`${API_BASE}/personal/license`, {
        method: 'POST',
        body: payload,
    });
}

export async function updateLicense(id, payload) {
    return requestWithAuth(`${API_BASE}/personal/license/${id}`, {
        method: 'PUT',
        body: payload,
    });
}

export async function deleteLicense(id) {
    return requestWithAuth(`${API_BASE}/personal/license/${id}`, {
        method: 'DELETE',
    });
}