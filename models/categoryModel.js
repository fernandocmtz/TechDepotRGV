import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';
import { Product } from './productModel.js';

// Define Category model
export const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'categories',
  timestamps: false
});

// Get all categories
export const getAllCategories = async () => {
  return await Category.findAll({
    attributes: [
      'category_id',
      'name',
      [sequelize.fn('COUNT', sequelize.col('Products.product_id')), 'productCount']
    ],
    include: [{
      model: Product,
      attributes: [],
    }],
    group: ['Category.category_id']
  });
};

// Get category by ID
export const getCategoryById = async (id) => {
  return await Category.findByPk(id);
};