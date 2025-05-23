import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const Address = sequelize.define(
  "Address",
  {
    address_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    address_line_1: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address_line_2: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    zip_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "addresses",
    timestamps: true,
    underscored: true,
  }
);
