import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

// Define Return model
export const Return = sequelize.define('Return', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_item_id: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'returns', timestamps: false });

// Process a return
export const processReturn = async (orderItemId, reason, status) => {
    const returnEntry = await Return.create({ order_item_id: orderItemId, reason, status });
    return returnEntry.id;
};
