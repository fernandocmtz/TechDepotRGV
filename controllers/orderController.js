import { createOrder } from "../models/orderModel.js";
import { ORDER_STATUS } from "../utils/constants.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, address } = req.body;
    const status = ORDER_STATUS.pending;
    const orderId = await createOrder(userId, address, status);
    res.json({ message: "Order placed successfully", orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
