import express from "express";
import { getAllOrderItems } from "../controllers/orderitemController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllOrderItems);

export default router;
