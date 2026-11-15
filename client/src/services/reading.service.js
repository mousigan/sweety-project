import api from './api.js';
const readingService = {
  getAll: (params) => api.get('/readings', { params }),
  getById: (id) => api.get(`/readings/${id}`),
  create: (data) => api.post('/readings', data),
  update: (id, data) => api.put(`/readings/${id}`, data),
  delete: (id) => api.delete(`/readings/${id}`),
};
export default readingService;
