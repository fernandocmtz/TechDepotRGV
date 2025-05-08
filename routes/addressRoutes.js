import express from "express";
import {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all addresses for logged-in user
router.get("/", verifyToken, getUserAddresses);

// POST a new address
router.post("/", verifyToken, addAddress);

// PUT update an existing address
router.put("/:id", verifyToken, updateAddress);

// DELETE an address
router.delete("/:id", verifyToken, deleteAddress);

export default router;
