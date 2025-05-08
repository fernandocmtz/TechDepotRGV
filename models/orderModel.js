import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";
import { ORDER_STATUS } from "../utils/constants.js";

export const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        ORDER_STATUS.CANCELLED,
        ORDER_STATUS.PENDING,
        ORDER_STATUS.PROCESSED,
        ORDER_STATUS.SHIPPED
      ),
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);
