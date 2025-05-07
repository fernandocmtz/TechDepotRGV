import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

// Define OrderItem model
export const OrderItem = sequelize.define('OrderItem', {
  order_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'order_id'
    },
    onDelete: 'CASCADE'
  },
  shipment_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'shipments',
      key: 'shipment_id'
    }
  },
  return_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'returns',
      key: 'return_id'
    }
  },
  item_sale_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'order_item',
  timestamps: false
});

// Get all order items
export const getAllOrderItems = async () => {
  return await OrderItem.findAll();
};

// Get order item by ID
export const getOrderItemById = async (id) => {
  return await OrderItem.findByPk(id);
};
