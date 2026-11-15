import api from './api.js';
const reportService = {
  getDaily: (date) => api.get('/reports/daily', { params: { date } }),
  getMonthToDate: (date) => api.get('/reports/month-to-date', { params: { date } }),
  getMonthly: (date) => api.get('/reports/monthly', { params: { date } }),
};
export default reportService;
