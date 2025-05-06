import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getAllCategories);         // GET all categories
router.get('/:id', getCategoryById);       // GET category by ID
router.post('/', createCategory);          // POST new category
router.put('/:id', updateCategory);        // PUT update category
router.delete('/:id', deleteCategory);     // DELETE category

export default router;
