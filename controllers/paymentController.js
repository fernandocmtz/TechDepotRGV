import { addPayment } from '../models/paymentModel.js';

export const processPayment = async (req, res) => {
    try {
        const { orderId, amount, method, status } = req.body;
        const paymentId = await addPayment(orderId, amount, method, status);
        res.json({ message: "Payment processed", paymentId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
