import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Create axios instance with auth support
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      window.location.href = '/login?redirect=' + window.location.pathname;
    }
    return Promise.reject(error);
  }
);

export const calculateSimplePAYE = async (payload) => {
  try {
    const response = await authApi.post('/api/calculate/simple-paye', payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Simple PAYE Calculation Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to calculate. Please try again.',
    };
  }
};

export default authApi;
