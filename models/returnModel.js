import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

// Define Return model
export const Return = sequelize.define('Return', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reason:{
        type:DataTypes.TEXT,
        allowNull: false
    },
    status:{
        type:DataTypes.ENUM('requested', 'approved', 'rejected', 'processed'),
        allowNull:false
    }
    
}, { tableName: 'returns',
     timestamps: true });




// Process a return
export const processReturn = async (orderItemId, reason, status) => {
    const returnEntry = await Return.create({ order_item_id: orderItemId, reason, status });
    return returnEntry.id;
};
