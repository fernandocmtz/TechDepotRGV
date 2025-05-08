import { Address } from "../models/addressModel.js";
import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import {
  COURIERS,
  GUEST_USER,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  SHIPMENT_STATUS,
} from "../utils/constants.js";
import { v4 as uuidv4 } from "uuid";
import { utilsGetFilteredProducts } from "./productController.js";
import { utilsSimulateCreatePayment } from "./paymentController.js";
import { addShipment } from "../models/shipmentModel.js";
import { Inventory } from "../models/inventoryModel.js";
import { OrderItem } from "../models/orderitemModel.js";
import bcrypt from "bcrypt";

export const createOrder = async (req, res, next) => {
  try {
    // Order information from the request
    const { address, products, paymentDetails } = req.body;

    // ---- User <> Order ----
    // Get user ID if logged in, a guest user is created if not logged in
    const userId = req.user?.id ?? null;

    const hashedPassword = await bcrypt.hash(GUEST_USER.PASSWORD, 10);

    const [verifiedUser] = await User.findOrCreate({
      where: { user_id: userId },
      defaults: {
        username: uuidv4(),
        first_name: GUEST_USER.FIRST_NAME,
        last_name: GUEST_USER.LAST_NAME,
        email: GUEST_USER.EMAIL,
        phone_number: GUEST_USER.PHONE_NUMBER,
        password: hashedPassword,
      },
    });

    // ---- Address <> Order ----
    // A new address is created if it doesn't exist
    const [verifiedAddress] = await Address.findOrCreate({
      where: {
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2 || null,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
        country: address.country,
        user_id: verifiedUser.user_id,
      },
      defaults: address,
    });

    // Create a pending order for the user + address
    // Pending status will get updated in this function
    const order = await Order.create({
      user_id: verifiedUser.user_id,
      address_id: verifiedAddress.address_id,
      status: ORDER_STATUS.PENDING,
    });

    const productsByProductId = products.reduce((acc, item) => {
      acc[item.product_id] = item;
      return acc;
    }, {});

    const orderedProducts = await utilsGetFilteredProducts({
      product_ids: Object.keys(productsByProductId),
    });

    // Verify enough product inventory to fulfill order
    const isAProductOverOrdered = orderedProducts.some((orderedProduct) => {
      return (
        orderedProduct.get("inventory_count") <
        productsByProductId[orderedProduct.product_id].quantity
      );
    });

    if (isAProductOverOrdered) {
      await Order.update(
        { status: ORDER_STATUS.CANCELLED },
        {
          where: { order_id: order.order_id },
        }
      );
      res.status(400).json({
        error: "Error: Order cancelled - Not enough stock to fulfill order",
      });
      return;
    }

    // Calculate payment
    const subtotal = orderedProducts.reduce(
      (sum, product) =>
        sum +
        Number(product.price) *
          (productsByProductId[product.product_id].quantity ?? 0),
      0
    );

    const finalAmount = subtotal * 1.07 + 10;

    // Payment is declined if card is expired
    const payment = await utilsSimulateCreatePayment(
      order.order_id,
      finalAmount,
      PAYMENT_METHOD.CREDIT_CARD,
      paymentDetails
    );

    if (payment.status === PAYMENT_STATUS.DECLINED) {
      await Order.update(
        { status: ORDER_STATUS.CANCELLED },
        {
          where: { order_id: order.order_id },
        }
      );
      res
        .status(402)
        .json({ error: "Error: Order cancelled - Payment declined" });
      return;
    }

    await Order.update(
      { status: ORDER_STATUS.PROCESSED },
      {
        where: { order_id: order.order_id },
      }
    );

    const newOrder = await Order.findByPk(order.order_id);

    const courier = COURIERS[Math.floor(Math.random() * COURIERS.length)];
    const trackingNumber = uuidv4();

    addShipment(
      order.order_id,
      courier,
      trackingNumber,
      SHIPMENT_STATUS.PREPARING
    );

    // Remove ordered items from inventory
    // Create ordered items for the ordered products
    for (const { product_id, price } of orderedProducts) {
      const num_picked = productsByProductId[product_id].quantity;

      for (let i = 0; i < num_picked; i++) {
        const selectedInventory = await Inventory.findOne({
          where: { product_id },
        });

        if (selectedInventory) {
          await selectedInventory.destroy(); // ← await this too
        }

        OrderItem.create({
          order_id: order.order_id,
          product_id,
          item_sale_price: price,
        });
      }
    }

    res.status(201).json({ newOrder });
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
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.update(req.body);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.destroy();
    res.json({ message: "Order deleted" });
  } catch (err) {
    next(err);
  }
};
