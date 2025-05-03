import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';
import { Category } from './categoryModel.js';

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
      model: Category, 
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
  return await Product.findAll({
  include: [{
    model: Category,
    attributes: ['name'], // Optional: only fetch the 'name' column
    }],
  });
};

// Get product by ID
export const getProductById = async (id) => {
  return await Product.findByPk(id);
};