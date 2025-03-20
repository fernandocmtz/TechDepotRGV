import { addShipment as addShipmentToDB } from '../models/shipmentModel.js'; // ✅ Renamed the import

export const addShipment = async (req, res) => {
    try {
        const { orderId, courier, trackingNumber, status } = req.body;
        const shipmentId = await addShipmentToDB(orderId, courier, trackingNumber, status); // ✅ Use renamed function
        res.json({ message: "Shipment added successfully", shipmentId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getShipments = async (req, res) => {
    try {
        const shipments = await getShipmentsFromDB();
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getShipmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const shipment = await getShipmentByIdFromDB(id);
        if (!shipment) {
            return res.status(404).json({ message: "Shipment not found" });
        }
        res.json(shipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateShipmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await updateShipmentStatusInDB(id, status);
        if (!updated) {
            return res.status(404).json({ message: "Shipment not found or not updated" });
        }
        res.json({ message: "Shipment status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteShipment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteShipmentFromDB(id);
        if (!deleted) {
            return res.status(404).json({ message: "Shipment not found" });
        }
        res.json({ message: "Shipment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
