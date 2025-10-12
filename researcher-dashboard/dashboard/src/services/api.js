import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('🔍 API Error Interceptor:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });
    
    // Only redirect to login for 401 errors on auth-related endpoints
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      
      if (isAuthEndpoint) {
        console.log('🔐 Auth error - redirecting to login');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } else {
        console.log('🔐 Non-auth 401 error - not redirecting');
        // Don't redirect for non-auth 401 errors, just log them
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Templates API
export const templatesAPI = {
  getAll: (params = {}) => api.get('/templates', { params }),
  getById: (id) => api.get(`/templates/${id}`),
  create: (templateData) => api.post('/templates', templateData),
  update: (id, templateData) => api.put(`/templates/${id}`, templateData),
  delete: (id) => api.delete(`/templates/${id}`),
  getSessions: (id) => api.get(`/templates/${id}/sessions`),
  getAvailableRespondents: (id) => api.get(`/templates/${id}/available-respondents`),
};

// Sessions API
export const sessionsAPI = {
  getAll: (params = {}) => api.get('/sessions', { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  start: (sessionData) => api.post('/sessions/start', sessionData),
  create: (sessionData) => api.post('/sessions/create', sessionData),
};

// Respondents API
export const respondentsAPI = {
  getAll: (params = {}) => api.get('/respondents', { params }),
  getById: (id) => api.get(`/respondents/${id}`),
  create: (respondentData) => api.post('/respondents', respondentData),
  update: (id, respondentData) => api.put(`/respondents/${id}`, respondentData),
  delete: (id) => api.delete(`/respondents/${id}`),
};

// Insights API
export const insightsAPI = {
  getOverview: (params = {}) => api.get('/insights/overview', { params }),
  getReport: (templateId) => api.post(`/templates/${templateId}/report`),
};

// Survey API
export const surveyAPI = {
  generate: (surveyData) => api.post('/surveys/generate', surveyData),
};

// Incentives API
export const incentivesAPI = {
  getPending: () => api.get('/incentives/pending'),
  markAsPaid: (id) => api.post(`/incentives/${id}/pay`),
};

export default api;
