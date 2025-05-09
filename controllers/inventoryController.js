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
