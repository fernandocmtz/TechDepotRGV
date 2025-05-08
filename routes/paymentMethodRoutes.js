import express from 'express';
import {
  addPaymentMethod,
  getUserPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod
} from '../controllers/paymentMethodController.js';

import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require authentication for all routes below
router.use(authenticateUser);

// GET all saved methods for the logged-in user
router.get('/', getUserPaymentMethods);

// POST a new payment method
router.post('/', addPaymentMethod);

// PUT update an existing method
router.put('/:id', updatePaymentMethod);

// DELETE a method
router.delete('/:id', deletePaymentMethod);

export default router;
