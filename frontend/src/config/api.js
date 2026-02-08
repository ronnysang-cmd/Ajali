const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  REPORTS: `${API_BASE_URL}/reports`,
  REPORT_BY_ID: (id) => `${API_BASE_URL}/reports/${id}`,
  UPLOAD_MEDIA: (reportId) => `${API_BASE_URL}/reports/${reportId}/media`,
  DELETE_MEDIA: (reportId, mediaId) => `${API_BASE_URL}/reports/${reportId}/media/${mediaId}`,
  UPDATE_STATUS: (reportId) => `${API_BASE_URL}/admin/reports/${reportId}/status`,
  STATUS_HISTORY: (reportId) => `${API_BASE_URL}/admin/reports/${reportId}/history`,
  ADMIN_STATS: `${API_BASE_URL}/admin/stats`,
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;