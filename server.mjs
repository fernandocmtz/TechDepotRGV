import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { sequelize } from './config/db';

// Import Routes
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Database Sync
sequelize.sync()
    .then(() => console.log('Database Synced'))
    .catch(err => console.log('Database Sync Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
