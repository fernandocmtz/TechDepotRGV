import express from "express";
import {
  getActiveUser,
  getUsers,
  patchActiveUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/active", verifyToken, getActiveUser);

router.patch("/active", verifyToken, patchActiveUser);

export default router;
