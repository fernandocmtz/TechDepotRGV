import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

// Define Order model
export const Order = sequelize.define('Order', {
    order_id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'users',
            key:'user_id'
        }
    },
    address_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
        //needs foreign key 
        // references:{
        //     model:'address',
        //     key:'address_id'
        //}
    },
    status: {
        type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
        allowNull: false
    }
}, { tableName: 'orders',
     timestamps: true });


// Create a new order
export const createOrder = async (userId, addressId, status) => {
    const order = await Order.create({ user_id: userId, address_id: addressId, status });
    return order.id;
};
