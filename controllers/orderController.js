import { createOrder } from '../models/orderModel.js';

export const placeOrder = async (req, res) => {
    try {
        const { userId, addressId, status } = req.body;
        const orderId = await createOrder(userId, addressId, status);
        res.json({ message: "Order placed successfully", orderId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
