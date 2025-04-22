import { getAllCategories, getCategoryById } from '../models/categoryModel.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
