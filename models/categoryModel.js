import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';
import { Product } from './productModel.js';

export const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
    description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'categories',
  timestamps: false
});
