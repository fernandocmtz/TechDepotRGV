import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

// Define Payment model
export const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    method: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'payments', timestamps: false });

// Add a new payment
export const addPayment = async (orderId, amount, method, status) => {
    const payment = await Payment.create({ order_id: orderId, amount, method, status });
    return payment.id;
};
