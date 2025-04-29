import { getAllInventories, getInventoryById } from '../models/inventoryModel.js';

export const getInventories = async (req, res) => {
    try {
        const categories = await getAllInventories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
