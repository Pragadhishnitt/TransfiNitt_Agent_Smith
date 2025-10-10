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
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
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
};

// Sessions API
export const sessionsAPI = {
  getAll: (params = {}) => api.get('/sessions', { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  start: (sessionData) => api.post('/sessions/start', sessionData),
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
