import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Assessment API calls
export const assessmentAPI = {
  saveInitial: (data) => api.post('/assessments/initial', data),
  saveFollowup: (data) => api.post('/assessments/followup', data),
  getUserAssessments: (userId) => api.get(`/assessments/${userId}`),
};

export default api;