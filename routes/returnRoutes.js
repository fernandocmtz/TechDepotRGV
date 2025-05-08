import express from "express";
import { processReturn } from "../controllers/returnController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, processReturn);

export default router;
