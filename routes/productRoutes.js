import express from "express";
import {
  getAllProducts,
  getFilteredProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../controllers/productController.js";
import { verifyAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/filter", getFilteredProducts);

router.post("/", verifyAdminToken, createProduct);
router.put("/:id", verifyAdminToken, updateProduct);
router.delete("/:id", verifyAdminToken, deleteProduct);

export default router;
