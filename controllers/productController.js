import { Product } from "../models/productModel.js";
import { Category } from "../models/categoryModel.js";
import { Op, Sequelize } from "sequelize";
import { Inventory } from "../models/inventoryModel.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("inventories.inventory_id")),
            "inventory_count",
          ],
        ],
      },
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Inventory,
          attributes: [],
        },
      ],
      group: ["Product.product_id", "Category.category_id"],
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const getFilteredProducts = async (req, res, next) => {
  try {
    const { minPrice, maxPrice, category_id, product_ids } = req.body;
    const whereClause = {};

    // Product ID filter
    if (product_ids?.length) {
      whereClause.product_id = {
        [Op.in]: product_ids,
      };
    }

    // Price filter
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice !== undefined)
        whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice !== undefined)
        whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    // Category filter (join with Category model)
    const includeClause = [
      {
        model: Category,
        attributes: ["name"], // Optional: only fetch the 'name' column
      },
      {
        model: Inventory,
        attributes: [],
      },
    ];
    if (category_id) {
      includeClause.push({
        model: Category,
        where: { category_id },
        attributes: [],
      });
    }

    const products = await Product.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("inventories.inventory_id")),
            "inventory_count",
          ],
        ],
      },
      where: whereClause,
      include: includeClause,
      group: ["Product.product_id", "Category.category_id"],
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.update(req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
