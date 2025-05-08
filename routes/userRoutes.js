import express from "express";
import {
  getActiveUser,
  getUsers,
  patchActiveUser,
  patchUserRole,
} from "../controllers/userController.js";
import { verifyAdminToken, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyAdminToken, getUsers);

router.get("/active", verifyToken, getActiveUser);

router.patch("/active", verifyToken, patchActiveUser);

router.patch("/role/:id", verifyAdminToken, patchUserRole);

export default router;
