import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";
import { SHIPMENT_STATUS } from "../utils/constants.js";

// Define the Shipment model
export const Shipment = sequelize.define(
  "Shipment",
  {
    shipment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    courier: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        SHIPMENT_STATUS.PREPARING,
        SHIPMENT_STATUS.SHIPPED,
        SHIPMENT_STATUS.DELIVERED
      ),
      allowNull: false,
    },
    tracking_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { tableName: "shipments", timestamps: true }
);

// Add a new shipment
export const addShipment = async (orderId, courier, trackingNumber, status) => {
  const shipment = await Shipment.create({
    order_id: orderId,
    courier,
    tracking_number: trackingNumber,
    status,
  });

  // Simulate shipment being shipped and delivered
  setTimeout(async () => {
    await Shipment.update(
      { status: SHIPMENT_STATUS.SHIPPED },
      {
        where: { shipment_id: shipment.shipment_id },
      }
    );
  }, 30000);

  setTimeout(async () => {
    await Shipment.update(
      {
        status: SHIPMENT_STATUS.DELIVERED,
        delivered_at: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      {
        where: { shipment_id: shipment.shipment_id },
      }
    );
  }, 60000);
  return shipment.id;
};

// Get all shipments
export const getShipmentsFromDB = async () => {
  return await Shipment.findAll();
};

// Get a shipment by ID
export const getShipmentByIdFromDB = async (id) => {
  return await Shipment.findByPk(id);
};

// Update shipment status
export const updateShipmentStatusInDB = async (id, status) => {
  const shipment = await Shipment.findByPk(id);
  if (!shipment) return false;
  shipment.status = status;
  await shipment.save();
  return true;
};

// Delete a shipment
export const deleteShipmentFromDB = async (id) => {
  const deleted = await Shipment.destroy({ where: { id } });
  return deleted > 0;
};
