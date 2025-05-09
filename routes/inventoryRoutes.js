import express from "express";
import {
  createInventory,
  deleteInventory,
  getInventories,
  populateMockInventory,
  putInventory,
} from "../controllers/inventoryController.js";
import { verifyAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getInventories);

router.get("/populate", populateMockInventory);

router.post("/", verifyAdminToken, createInventory);

router.put("/:id", verifyAdminToken, putInventory);

router.delete("/:id", verifyAdminToken, deleteInventory);

export default router;
