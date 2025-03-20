import { addShipment } from '../models/shipmentModel.js';

export const addShipment = async (req, res) => {
    try {
        const { orderId, courier, trackingNumber, status } = req.body;
        const shipmentId = await addShipment(orderId, courier, trackingNumber, status);
        res.json({ message: "Shipment added successfully", shipmentId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
