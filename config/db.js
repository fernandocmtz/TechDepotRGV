import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); 
console.log("🔍 Loaded DB credentials:");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS ? "(set)" : "(not set)");
console.log("DB_NAME:", process.env.DB_NAME);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    },
    logging: false,
  }
);

export { sequelize };
