import authApi from './authApi';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api';

// Helper function to handle API responses consistently
// Laravel sometimes returns data directly, sometimes wrapped in { data: [...] }
const handleArrayResponse = (response) => {
  return Array.isArray(response.data) ? response.data : (response.data.data || []);
};

// Company API
export const companyApi = {
  getAll: async () => {
    const response = await authApi.get('/companies');
    return { ...response, data: handleArrayResponse(response) };
  },
  get: (id) => authApi.get(`/companies/${id}`),
  create: (data) => authApi.post('/companies', data),
  update: (id, data) => authApi.put(`/companies/${id}`, data),
  delete: (id) => authApi.delete(`/companies/${id}`),
  uploadLogo: (id, formData) => authApi.post(`/companies/${id}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Employee API
export const employeeApi = {
  getAll: async (params) => {
    const response = await authApi.get('/employees', { params });
    return { ...response, data: handleArrayResponse(response) };
  },
  get: (id) => authApi.get(`/employees/${id}`),
  create: (data) => authApi.post('/employees', data),
  update: (id, data) => authApi.put(`/employees/${id}`, data),
  delete: (id) => authApi.delete(`/employees/${id}`),
  getCalculations: (id) => authApi.get(`/employees/${id}/calculations`),
};

// Payroll API
export const payrollApi = {
  getAll: async (params) => {
    const response = await authApi.get('/payroll', { params });
    return { ...response, data: handleArrayResponse(response) };
  },
  get: (id) => authApi.get(`/payroll/${id}`),
  create: (data) => authApi.post('/payroll', data),
  delete: (id) => authApi.delete(`/payroll/${id}`),
  getStats: () => authApi.get('/payroll-stats'),
  getHistory: () => authApi.get('/payroll-history'),
};
