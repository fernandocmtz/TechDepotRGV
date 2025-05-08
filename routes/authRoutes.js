import express from 'express';
import { login, register, updateUser } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

//  Public routes
router.post('/login', login);
router.post('/register', register);

//  Protected routes (requires a valid JWT)
router.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'You have accessed a protected route', user: req.user });
});

// Get current user info
router.get('/active_user', authenticateUser, (req, res) => {
  res.json(req.user); // Assumes your middleware sets req.user from JWT
});

// Update current user's info
router.put('/users', authenticateUser, updateUser);

// Admin-only route
router.get('/admin', authenticateUser, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

export default router;
