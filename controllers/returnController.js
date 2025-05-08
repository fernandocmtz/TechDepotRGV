import { Inventory } from "../models/inventoryModel.js";
import { OrderItem } from "../models/orderitemModel.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import {
  processReturn as processReturnFromDB,
  Return,
} from "../models/returnModel.js"; // ✅ Renamed the import
import { RETURN_STATUS } from "../utils/constants.js";
import { v4 as uuidv4 } from "uuid";

export const processReturn = async (req, res) => {
  try {
    const { order_item_id, reason } = req.body;
    const status = RETURN_STATUS.APPROVED;

    // Find all non-returned items ordered by user
    const orders = await Order.findAll({
      where: { user_id: req.user?.id },
      include: [
        {
          model: OrderItem,
          include: [
            { model: Return, required: false }, // LEFT JOIN
            { model: Product }, // optional
          ],
        },
      ],
    });
    // Flatten and filter only non-returned items
    const orderItems = orders.flatMap((order) =>
      order.OrderItems.filter((item) => item.Return === null).map((item) => ({
        order_item_id: item.order_item_id,
        product_id: item.Product?.product_id,
      }))
    );

    const returnOrderItem = orderItems.find(
      (orderItem) => (orderItem.order_item_id = order_item_id)
    );

    if (!returnOrderItem) {
      res.status(400).json({ error: "Cannot find order item" });
      return;
    }

    const returnId = await processReturnFromDB(order_item_id, reason, status); // ✅ Use renamed function

    await Inventory.create({
      sku: uuidv4(),
      product_id: returnOrderItem.product_id,
    });

    res.json({ message: "Return processed successfully", returnId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
