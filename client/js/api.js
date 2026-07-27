// ========== API CLIENT ==========
const API_BASE = '/api';

function getToken() {
    return localStorage.getItem('authToken');
}

function setToken(token) {
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
}

async function apiRequest(path, { method = 'GET', body, isFormData = false } = {}) {
    const headers = {};
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';

    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            method,
            headers,
            body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
        });
    } catch (networkErr) {
        throw new Error('Could not reach the server. Please check your connection and try again.');
    }

    // A 401 from the login/register endpoints means the credentials were wrong,
    // not that a session lapsed - so let those fall through to the normal error
    // handling below and surface the server's actual message.
    const isAuthAttempt = path.startsWith('/auth/');

    if (response.status === 401 && !isAuthAttempt) {
        setToken(null);
        if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
        throw new Error('Session expired. Please log in again.');
    }

    if (response.status === 204) return null;

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
        throw new Error((data && data.error) || `Request failed (${response.status})`);
    }

    return data;
}

const api = {
    get: (path) => apiRequest(path),
    post: (path, body) => apiRequest(path, { method: 'POST', body }),
    put: (path, body) => apiRequest(path, { method: 'PUT', body }),
    delete: (path) => apiRequest(path, { method: 'DELETE' }),
    upload: (path, formData) => apiRequest(path, { method: 'POST', body: formData, isFormData: true })
};
