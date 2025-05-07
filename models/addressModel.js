import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const Address = sequelize.define(
  "Address",
  {
    address_line_1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_line_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "addresses",
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);
