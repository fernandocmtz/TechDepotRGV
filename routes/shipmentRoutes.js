import express from 'express';
import { addShipment } from '../controllers/shipmentController.js';

const router = express.Router();

router.post('/', addShipment);

export default router;
