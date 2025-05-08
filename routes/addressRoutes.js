import express from 'express';
import {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

// GET all addresses for logged-in user
router.get('/', getUserAddresses);

// POST a new address
router.post('/', addAddress);

// PUT update an existing address
router.put('/:id', updateAddress);

// DELETE an address
router.delete('/:id', deleteAddress);

export default router;
