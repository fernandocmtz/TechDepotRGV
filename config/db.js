import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,  // Default to 3306
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false // ✅ Enables secure authentication
        }
    },
    logging: false, // Disable logging for cleaner output
});

export { sequelize };
