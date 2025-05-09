import { addPayment } from "../models/paymentModel.js";
import { PAYMENT_STATUS } from "../utils/constants.js";

export const processPayment = async (req, res) => {
  try {
    const { orderId, amount, method, paymentInfo, status } = req.body;
    const paymentId = await addPayment(
      orderId,
      amount,
      method,
      paymentInfo,
      status
    );
    res.json({ message: "Payment processed", paymentId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approved if Credit card is not expired
export const utilsSimulateCreatePayment = async (
  orderId,
  amount,
  method,
  paymentInfo
) => {
  const status = isCardExpired(paymentInfo.card_expiry)
    ? PAYMENT_STATUS.DECLINED
    : PAYMENT_STATUS.APPROVED;

  const paymentId = await addPayment(
    orderId,
    amount,
    method,
    paymentInfo,
    status
  );

  return paymentId;
};

function isCardExpired(expiry) {
  const [expMonth, expYear] = expiry.split("/").map(Number);
  if (!expMonth || !expYear || expMonth < 1 || expMonth > 12) return true;

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 0-based index
  const currentYear = now.getFullYear() % 100; // Get last two digits

  return (
    expYear < currentYear ||
    (expYear === currentYear && expMonth < currentMonth)
  );
}
