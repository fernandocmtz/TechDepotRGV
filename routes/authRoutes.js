import express from "express";
import {
  login,
  register,
  refreshToken,
  logout,
  getProtected,
  getAdminOnly,
} from "../controllers/authController.js";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.post("/login", login);
router.post("/register", register);
router.post("/refresh_token", refreshToken);
router.post("/logout", logout);

// Protected (requires token)
router.get("/protected", verifyToken, getProtected);

// Admin-only route
router.get("/admin", verifyToken, requireAdmin, getAdminOnly);

export default router;
