import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

// Define the User model
export const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(10),
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: "user" },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

// Fetch all users
export const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["password"] },
  });
};

// Fetch user by ID
export const getUserById = async (id) => {
  return await User.findByPk(id, { attributes: { exclude: ["password"] } });
};
