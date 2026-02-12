import { API_ENDPOINTS } from '../config/api.js';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const authService = {
  async register(data) {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Registration failed');
    if (result.access_token) {
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    return result;
  },

  async login(email, password) {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Login failed');
    if (result.access_token) {
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    return result;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },
};

export const reportService = {
  async getReports(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_ENDPOINTS.REPORTS}?${query}` : API_ENDPOINTS.REPORTS;
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch reports');
    return result;
  },

  async getReport(id) {
    const response = await fetch(API_ENDPOINTS.REPORT_BY_ID(id), {
      headers: getAuthHeader(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch report');
    return result;
  },

  async createReport(data) {
    const response = await fetch(API_ENDPOINTS.REPORTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to create report');
    return result;
  },

  async updateReport(id, data) {
    const response = await fetch(API_ENDPOINTS.REPORT_BY_ID(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to update report');
    return result;
  },

  async deleteReport(id) {
    const response = await fetch(API_ENDPOINTS.REPORT_BY_ID(id), {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to delete report');
    return result;
  },

  async uploadMedia(reportId, file, mediaType) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('media_type', mediaType);

    const response = await fetch(API_ENDPOINTS.UPLOAD_MEDIA(reportId), {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to upload media');
    return result;
  },
};

export const adminService = {
  async updateStatus(reportId, status, comment) {
    const response = await fetch(API_ENDPOINTS.UPDATE_STATUS(reportId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, comment }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to update status');
    return result;
  },

  async getStatusHistory(reportId) {
    const response = await fetch(API_ENDPOINTS.STATUS_HISTORY(reportId), {
      headers: getAuthHeader(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch history');
    return result;
  },

  async getStats() {
    const response = await fetch(API_ENDPOINTS.ADMIN_STATS, {
      headers: getAuthHeader(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch stats');
    return result;
  },
};