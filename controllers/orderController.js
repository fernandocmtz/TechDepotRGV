import { createOrder } from "../models/orderModel.js";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../utils/constants.js";
import { utilsSimulateCreatePayment } from "./paymentController.js";
import { utilsGetFilteredProducts } from "./productController.js";

export const placeOrder = async (req, res) => {
  try {
    const { address, products, paymentDetails } = req.body;
    const status = ORDER_STATUS.PENDING;
    const orderId = await createOrder(req.user?.id ?? null, address, status);

    const productsByProductId = products.reduce((acc, item) => {
      acc[item.product_id] = item;
      return acc;
    }, {});
    const orderedProducts = await utilsGetFilteredProducts({
      product_ids: Object.keys(productsByProductId),
    });

    const subtotal = orderedProducts.reduce(
      (sum, product) =>
        sum +
        Number(product.price) *
          (productsByProductId[product.product_id].quantity ?? 0),
      0
    );

    const finalAmount = (subtotal + 10) * 1.07;

    // Payment
    const payment = await utilsSimulateCreatePayment(
      orderId,
      finalAmount,
      PAYMENT_METHOD.CREDIT_CARD,
      paymentDetails
    );

    if (payment.status === PAYMENT_STATUS.DECLINED) {
      res.status(402).json({ error: "Error: Payment declined" });
      return;
    }

    res.json({ message: "Order placed successfully", orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
