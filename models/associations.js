import { RefreshToken } from "./authModel.js";
import { User } from "./userModel.js";
import { Product } from "./productModel.js";
import { Category } from "./categoryModel.js";
import { Inventory } from "./inventoryModel.js";
import { Order } from "./orderModel.js";
import { OrderItem } from "./orderitemModel.js";
import { Payment } from "./paymentModel.js";
import { Shipment } from "./shipmentModel.js";
import { Return } from "./returnModel.js";
import { Address } from "./addressModel.js";

export const associateModels = () => {
  // User - Tokens
  RefreshToken.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
  User.hasMany(RefreshToken, { foreignKey: "user_id" });

  // Category - Product
  Category.hasMany(Product, { foreignKey: "category_id" });
  Product.belongsTo(Category, { foreignKey: "category_id" });

  // Product - Inventory
  Product.hasMany(Inventory, { foreignKey: "product_id", onDelete: "CASCADE" });
  Inventory.belongsTo(Product, { foreignKey: "product_id" });

  // User - Address
  User.hasMany(Address, { foreignKey: "user_id", onDelete: "CASCADE" });
  Address.belongsTo(User, { foreignKey: "user_id" });

  // User - Order
  User.hasMany(Order, { foreignKey: "user_id", onDelete: "CASCADE" });
  Order.belongsTo(User, { foreignKey: "user_id" });

  // Address - Order (shipping address)
  Address.hasMany(Order, { foreignKey: "address_id" });
  Order.belongsTo(Address, { foreignKey: "address_id" });

  // Order - OrderItems
  Order.hasMany(OrderItem, { foreignKey: "order_id", onDelete: "CASCADE" });
  OrderItem.belongsTo(Order, { foreignKey: "order_id" });

  // Product - OrderItems
  Product.hasMany(OrderItem, { foreignKey: "product_id", onDelete: "CASCADE" });
  OrderItem.belongsTo(Product, { foreignKey: "product_id" });

  // Order - Payment
  Order.hasOne(Payment, { foreignKey: "order_id", onDelete: "CASCADE" });
  Payment.belongsTo(Order, { foreignKey: "order_id" });

  // Order - Shipment
  Order.hasOne(Shipment, { foreignKey: "order_id", onDelete: "CASCADE" });
  Shipment.belongsTo(Order, { foreignKey: "order_id" });

  // User - Return
  User.hasMany(Return, { foreignKey: "user_id", onDelete: "CASCADE" });
  Return.belongsTo(User, { foreignKey: "user_id" });

  // Product - Return
  Product.hasMany(Return, { foreignKey: "product_id", onDelete: "CASCADE" });
  Return.belongsTo(Product, { foreignKey: "product_id" });
};
