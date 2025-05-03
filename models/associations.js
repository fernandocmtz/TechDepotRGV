import { Product } from './productModel.js';
import { Category } from './categoryModel.js';

export const associateModels = () => {
  Category.hasMany(Product, {
    foreignKey: 'category_id',
  });

  Product.belongsTo(Category, {
    foreignKey: 'category_id',
  });

}

