import express from "express";
import { placeOrder } from "../controllers/orderController.js";
import { verifyTokenThenContinue } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyTokenThenContinue, placeOrder);

export default router;
