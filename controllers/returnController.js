import { processReturn } from '../models/returnModel.js';

export const processReturn = async (req, res) => {
    try {
        const { orderItemId, reason, status } = req.body;
        const returnId = await processReturn(orderItemId, reason, status);
        res.json({ message: "Return processed successfully", returnId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
