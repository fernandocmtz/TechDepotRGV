import express from 'express';
import { addShipment, getShipments, getShipmentById, updateShipmentStatus, deleteShipment } from '../controllers/shipmentController.js';

const router = express.Router();

router.post('/', addShipment);
router.get('/', getShipments);
router.get('/:id', getShipmentById);
router.put('/:id/status', updateShipmentStatus);
router.delete('/:id', deleteShipment);

export default router;
