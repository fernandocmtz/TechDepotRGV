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

export const createPayment = async (req, res) => {
    try {
      const { order_id, method, amount } = req.body;
  
      // Example Sequelize or raw insert logic here
      const newPayment = await Payment.create({
        order_id,
        method,
        amount,
        status: 'pending',
      });
  
      res.status(201).json(newPayment);
    } catch (err) {
      console.error('Payment creation failed:', err.message);
      res.status(500).json({ message: 'Payment failed', error: err.message });
    }
  };
  