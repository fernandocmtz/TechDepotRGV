import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

// Define Payment model
export const Payment = sequelize.define('Payment', {
    payment_id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id:{
        type:DataTypes.INTEGER,
        allowNull: false,
        reference:{
            model:'orders',
            key:"order_id"
        }
    },
    status:{
        type:DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false
    },
    method:{
        type:DataTypes.ENUM('credit_card', 'paypal', 'crypto', 'cash_on_delivery'),
        allowNull: false
    },
    amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull: false
    }
}, { tableName: 'payments',
     timestamps: true });

// Add a new payment
export const addPayment = async (orderId, amount, method, status) => {
    const payment = await Payment.create({ order_id: orderId, amount, method, status });
    return payment.id;
};
