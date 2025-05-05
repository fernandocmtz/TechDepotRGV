import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';


// Define the User model
export const User = sequelize.define('User', {
    user_id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type:DataTypes.STRING(50),
        allowNull: false
    },
    last_name:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    email:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    phone_number:{
        type:DataTypes.STRING(10),
    },
    password:{
        type:DataTypes.STRING(20),
        allowNull: false
    },
    address_id:{
        type:DataTypes.INTEGER,
        refernece: {
            model: 'address_id',
            key: 'address_id'
        }
    },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
}, {
     tableName: 'users',
     timestamps: false });


// Fetch all users
export const getAllUsers = async () => {
    return await User.findAll();
};

// Fetch user by ID
export const getUserById = async (id) => {
    return await User.findByPk(id);
};
