import express from 'express';
import { processReturn } from '../controllers/returnController.js';

const router = express.Router();

router.post('/', processReturn);

export default router;
