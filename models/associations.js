import { RefreshToken } from "./authModel.js";
import { User } from "./userModel.js";
import { Product } from "./productModel.js";
import { Category } from "./categoryModel.js";
import { Inventory } from "./inventoryModel.js";
import { Address } from "./addressModel.js";
import { Order } from "./orderModel.js";
import { Payment } from "./paymentModel.js";

export const associateModels = () => {
  RefreshToken.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
  User.hasMany(RefreshToken, { foreignKey: "user_id" });
  Category.hasMany(Product, {
    foreignKey: "category_id",
  });

  Product.belongsTo(Category, {
    foreignKey: "category_id",
  });

  Product.hasMany(Inventory, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
  });

  Inventory.belongsTo(Product, {
    foreignKey: "product_id",
  });

  Address.belongsTo(User, {
    foreignKey: {
      name: "user_id",
      allowNull: false,
    },
    onDelete: "CASCADE",
  });

  User.hasMany(Address, {
    foreignKey: "user_id",
  });

  Order.hasOne(Payment, {
    foreignKey: {
      name: "order_id",
      allowNull: false,
      unique: true, // ensures 1-to-1
    },
    onDelete: "CASCADE",
  });

  Payment.belongsTo(Order, {
    foreignKey: {
      name: "order_id",
      allowNull: false,
      unique: true,
    },
  });
};
