import { v4 as uuidv4 } from "uuid";
import {
  getAllInventories,
  getInventoryById,
  Inventory,
} from "../models/inventoryModel.js";

export const getInventories = async (req, res) => {
  try {
    const inventory = await getAllInventories();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createInventory = async (req, res) => {
  try {
    const { sku, product_id } = req.body;
    const inventory = await Inventory.create({
      sku,
      product_id,
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Test function to populate database with mock inventory
export const populateMockInventory = async (req, res) => {
  try {
    const productIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const now = new Date();

    const noInventoryProductId = 5;
    const lowInventoryProductIds = [3, 9];

    for (const productId of productIds) {
      if (productId === noInventoryProductId) {
        continue; // skip this product
      }

      let count;
      if (lowInventoryProductIds.includes(productId)) {
        count = Math.floor(Math.random() * 5) + 1; // 1 to 5
      } else {
        count = Math.floor(Math.random() * 16) + 10; // 10 to 25
      }

      for (let i = 0; i < count; i++) {
        await Inventory.create({
          product_id: productId,
          sku: uuidv4(),
          created_at: now,
          updated_at: now,
        });
      }
    }
    res.json({ message: "success" });
  } catch {
    res.status(500).json({ error: "error" });
  }
};

export const putInventory = async (req, res) => {
  const { sku, product_id } = req.body;
  const inventoryId = req.params.id;

  if (!sku || !product_id) {
    return res.status(400).json({ error: "SKU and product_id are required" });
  }

  try {
    const inventory = await Inventory.findByPk(inventoryId);
    if (!inventory) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    inventory.sku = sku;
    inventory.product_id = product_id;

    await inventory.save();

    res.json({ message: "Inventory updated", inventory });
  } catch (err) {
    res.status(500).json({ error: "Failed to update inventory item" });
  }
};

export const deleteInventory = async (req, res) => {
  const inventoryId = req.params.id;

  try {
    const inventory = await Inventory.findByPk(inventoryId);
    if (!inventory) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    await inventory.destroy();

    res.json({ message: "Inventory item deleted successfully" });
  } catch (err) {
    console.error("Error deleting inventory:", err);
    res.status(500).json({ error: "Failed to delete inventory item" });
  }
};
