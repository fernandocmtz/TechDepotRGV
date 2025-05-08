import express from "express";
import { getActiveUser, getUsers } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/active", verifyToken, getActiveUser);

export default router;
