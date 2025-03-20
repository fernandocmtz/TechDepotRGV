import { processReturn as processReturnFromDB } from '../models/returnModel.js'; // ✅ Renamed the import

export const processReturn = async (req, res) => {
    try {
        const { orderItemId, reason, status } = req.body;
        const returnId = await processReturnFromDB(orderItemId, reason, status); // ✅ Use renamed function
        res.json({ message: "Return processed successfully", returnId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
