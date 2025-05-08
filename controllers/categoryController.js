import { Category } from "../models/categoryModel.js";
import { sequelize } from "../config/db.js";
import { Product } from "../models/productModel.js";

export const getAllCategories = async (req, res, next) => {
  const categories = await Category.findAll({
    attributes: [
      "category_id",
      "name",
      "image_url",
      [
        sequelize.fn("COUNT", sequelize.col("Products.product_id")),
        "productCount",
      ],
    ],
    include: [
      {
        model: Product,
        attributes: [],
      },
    ],
    group: ["Category.category_id"],
  });

  res.json(categories);
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await category.update(req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await category.destroy();
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};
