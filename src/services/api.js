import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Livestock API
export const livestockApi = {
  getAll: () => api.get('/livestock'),
  getById: (id) => api.get(`/livestock/${id}`),
  create: (data) => api.post('/livestock', data),
  update: (id, data) => api.put(`/livestock/${id}`, data),
  delete: (id) => api.delete(`/livestock/${id}`),
};

// Inventory API
export const inventoryApi = {
  getAll: () => api.get('/inventory'),
  getLowStock: () => api.get('/inventory/low-stock'),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
};

// Health Records API
export const healthApi = {
  getAll: () => api.get('/health-records'),
  getUpcoming: () => api.get('/health-records/upcoming'),
  create: (data) => api.post('/health-records', data),
  update: (id, data) => api.put(`/health-records/${id}`, data),
};

// Sales API
export const salesApi = {
  getAll: () => api.get('/sales'),
  getStats: () => api.get('/sales/stats'),
  create: (data) => api.post('/sales', data),
  export: (params) => api.get('/sales/export', { params }),
};

// Tasks API
export const tasksApi = {
  getAll: () => api.get('/tasks'),
  getToday: () => api.get('/tasks/today'),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  complete: (id) => api.patch(`/tasks/${id}/complete`),
};

// Weather API Service
export const weatherApi = {
  getCurrent: (lat, lon) => 
    axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat,
        lon,
        appid: process.env.REACT_APP_WEATHER_API_KEY,
        units: 'metric',
      },
    }),
};

export default api;