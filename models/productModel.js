import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

// Define Product model
export const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'products', timestamps: false });

// Get all products
export const getAllProducts = async () => {
    return await Product.findAll();
};

// Get product by ID
export const getProductById = async (id) => {
    return await Product.findByPk(id);
};
