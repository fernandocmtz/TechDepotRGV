import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

// Define the User model
export const User = sequelize.define('User', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'users', timestamps: false });

// Fetch all users
export const getAllUsers = async () => {
    return await User.findAll(); // ✅ Replaces `pool.query()`
};

// Fetch user by ID
export const getUserById = async (id) => {
    return await User.findByPk(id); // ✅ Replaces `pool.query()`
};
