import { OrderItem } from '../models/orderitemModel.js';

// Get all order items
export const getAllOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order items' });
  }
};

// Get one order item by ID
export const getOrderItemById = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order item' });
  }
};

// Create new order item
export const createOrderItem = async (req, res) => {
  try {
    const newItem = await OrderItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order item', details: error.message });
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
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order item', details: error.message });
  }
};

// Delete an order item
export const deleteOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (item) {
      await item.destroy();
      res.json({ message: 'Order item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order item' });
  }
};
