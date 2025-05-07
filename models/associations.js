import { RefreshToken } from "./authModel.js";
import { User } from "./userModel.js";
import { Product } from "./productModel.js";
import { Category } from "./categoryModel.js";

export const associateModels = () => {
  RefreshToken.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
  User.hasMany(RefreshToken, { foreignKey: "user_id" });
  Category.hasMany(Product, {
    foreignKey: "category_id",
  });

  Product.belongsTo(Category, {
    foreignKey: "category_id",
  });
};
