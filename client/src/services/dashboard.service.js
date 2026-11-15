import api from './api.js';
const dashboardService = {
  getData: (params) => api.get('/dashboard', { params }),
};
export default dashboardService;
