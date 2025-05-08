import { Order } from '../models/orderModel.js';

export const createOrder = async (req, res, next) => {
  try {

    const verifiedUser = await utilFindOrCreateUserByUserId(userId);
    // Find associated user and address, if not found, create them
    const verifiedAddress = await utilfindOrCreateAddress({
      ...address,
      user_id: verifiedUser.user_id,
    });
  
    const order = await Order.create({
      user_id: verifiedUser.user_id,
      address_id: verifiedAddress.id,
      status,
    });


    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.update(req.body);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.destroy();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
};
