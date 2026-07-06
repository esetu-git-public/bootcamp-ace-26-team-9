import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error formatting
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.error || error.message || 'Network error occurred. Please check if Flask server is running.',
      details: error.response?.data?.details || error.response?.data?.action || null,
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

export const checkHealth = () => apiClient.get('/health');
export const getDashboard = () => apiClient.get('/dashboard');
export const getAnalytics = () => apiClient.get('/analytics');
export const predictAttrition = (formData) => apiClient.post('/predict', formData);

export default apiClient;
