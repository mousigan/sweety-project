// ============================================
// Glucose Reading Routes
// ============================================
import { Router } from 'express';
import * as readingController from '../controllers/reading.controller.js';
import {
  createReadingValidator,
  updateReadingValidator,
  readingIdValidator,
} from '../validators/reading.validator.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

// All reading routes require authentication
router.use(authenticate);

router.post('/', createReadingValidator, validate, readingController.createReading);
router.get('/', readingController.getReadings);
router.get('/:id', readingIdValidator, validate, readingController.getReadingById);
router.put('/:id', updateReadingValidator, validate, readingController.updateReading);
router.delete('/:id', readingIdValidator, validate, readingController.deleteReading);

export default router;
