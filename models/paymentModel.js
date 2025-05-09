import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "../utils/constants.js";

// Define Payment model
export const Payment = sequelize.define(
  "Payment",
  {
    payment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
        model: "orders",
        key: "order_id",
      },
    },
    status: {
      type: DataTypes.ENUM(PAYMENT_STATUS.APPROVED, PAYMENT_STATUS.DECLINED),
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM(PAYMENT_METHOD.CREDIT_CARD),
      allowNull: false,
    },
    card_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    card_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    card_expiry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    card_cvv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    card_iv: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  { tableName: "payments", timestamps: true }
);

// Add a new payment
export const addPayment = async (
  orderId,
  amount,
  method,
  paymentInfo,
  status
) => {
  const payment = await Payment.create({
    order_id: orderId,
    amount,
    method,
    status,
    card_number: paymentInfo.card_number,
    card_name: paymentInfo.card_name,
    card_expiry: paymentInfo.card_expiry,
    card_cvv: paymentInfo.card_cvv,
  });
  return payment;
};
