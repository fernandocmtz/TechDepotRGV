import { getAllProducts, getProductById } from '../models/productModel.js';

export const getProducts = async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
