import express from 'express';
import { login, register, getProtected, getAdminOnly } from '../controllers/authController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.post('/login', login);
router.post('/register', register);

// Protected (requires token)
router.get('/protected', verifyToken, getProtected);

// Admin-only route
router.get('/admin', verifyToken, requireAdmin, getAdminOnly);

export default router;