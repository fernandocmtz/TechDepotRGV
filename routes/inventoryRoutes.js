import express from 'express';
import { getInventories } from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', getInventories);

export default router;
