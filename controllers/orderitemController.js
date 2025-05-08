import { OrderItem } from "../models/orderitemModel.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { Return } from "../models/returnModel.js";

// Get all order items
export const getAllOrderItems = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [
            { model: Return, required: false }, // LEFT JOIN
            { model: Product },
          ],
        },
      ],
    });
    // Flatten and filter only non-returned items
    const items = orders.flatMap((order) =>
      order.OrderItems.filter((item) => item.Return === null).map((item) => ({
        ordered_at: order.createdAt,
        order_item_id: item.order_item_id,
        order_id: item.order_id,
        product_name: item.Product?.name,
        price: item.Product?.price,
      }))
    );

    res.json(items);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch order items", message: error.message });
  }
};

// Get one order item by ID
export const getOrderItemById = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Order item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order item" });
  }
};

// Create new order item
export const createOrderItem = async (req, res) => {
  try {
    const newItem = await OrderItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to create order item", details: error.message });
  }
};

// Update an order item
export const updateOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (item) {
      await item.update(req.body);
      res.json(item);
    } else {
      res.status(404).json({ error: "Order item not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to update order item", details: error.message });
  }
};

// Delete an order item
export const deleteOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (item) {
      await item.destroy();
      res.json({ message: "Order item deleted successfully" });
    } else {
      res.status(404).json({ error: "Order item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order item" });
  }
};
