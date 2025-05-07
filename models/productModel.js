import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

// Define Product model
export const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'category_id'
    }
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true
});

// Get all products
export const getAllProducts = async () => {
  return await Product.findAll();
};

// Get product by ID
export const getProductById = async (id) => {
  return await Product.findByPk(id);
};