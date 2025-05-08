import express from 'express';
import { processPayment } from '../controllers/paymentController.js';
import {createPayment} from '../controllers/paymentController.js';
import {authenticateUser} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', processPayment);
router.post('/', authenticateUser, createPayment);

export default router;
