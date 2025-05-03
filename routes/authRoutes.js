import express from 'express';
import { login } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'You have accessed a protected route', user: req.user });
});
router.get('/admin', authenticateUser, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

export default router;


