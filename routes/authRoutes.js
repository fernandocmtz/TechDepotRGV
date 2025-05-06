import express from 'express';
import { login, register, refreshToken, logout } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

//  Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/refresh_token', refreshToken)
router.post('/logout', logout);

//  Protected routes (requires a valid JWT)
router.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'You have accessed a protected route', user: req.user });
});

// Admin-only route
router.get('/admin', authenticateUser, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

export default router;
