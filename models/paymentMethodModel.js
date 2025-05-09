import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const PaymentMethod = sequelize.define('PaymentMethod', {
  method_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cardholder_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  card_last4: {
    type: DataTypes.STRING(4),
    allowNull: false
  },
  expiration_date: {
    type: DataTypes.STRING(7),
    allowNull: false
  },
  brand: {
    type: DataTypes.ENUM('visa', 'mastercard', 'amex', 'paypal'),
    allowNull: false
  },
}, {
  tableName: 'payment_methods',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});
