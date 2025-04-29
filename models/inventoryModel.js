import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

// Define Inventory model
export const Inventory = sequelize.define('Inventory', {
  inventory_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'product_id'
    }
  },
}, {
  tableName: 'inventory',
  timestamps: true,
  underscored: true
});

// Get all inventories
export const getAllInventories = async () => {
  return await Inventory.findAll();
};

// Get inventory by ID
export const getInventoryById = async (id) => {
  return await Inventory.findByPk(id);
};