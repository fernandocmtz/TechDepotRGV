import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const OrderItem = sequelize.define(
  "OrderItem",
  {
    order_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
        key: "order_id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "product_id",
      },
    },
    return_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "returns",
        key: "return_id",
      },
    },
    item_sale_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    timestamps: true,
    underscored: true,
  }
);
