// ============================================
// Report Routes
// ============================================
import { Router } from 'express';
import * as reportController from '../controllers/report.controller.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

// All report routes require authentication
router.use(authenticate);

router.get('/daily', reportController.getDailyReport);
router.get('/month-to-date', reportController.getMonthToDateReport);
router.get('/monthly', reportController.getMonthlyReport);

export default router;
