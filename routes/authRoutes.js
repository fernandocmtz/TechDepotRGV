import express from "express";
import {
  login,
  register,
  updateUser,
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

// Get current user info
router.get("/active_user", verifyToken, (req, res) => {
  res.json(req.user); // Assumes your middleware sets req.user from JWT
});

// Update current user's info
router.put("/users", verifyToken, updateUser);

// Admin-only route
router.get("/admin", verifyToken, requireAdmin, getAdminOnly);

export default router;
