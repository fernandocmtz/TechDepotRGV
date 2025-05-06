import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from '../controllers/productController.js';

import validateProduct from '../middleware/productValidator.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', validateProduct, validateRequest, createProduct);
router.put('/:id', validateProduct, validateRequest, updateProduct);
router.delete('/:id', deleteProduct);

export default router;