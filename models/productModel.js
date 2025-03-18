const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Product;
