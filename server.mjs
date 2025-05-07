import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";

// Import Routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderitemRoutes from "./routes/orderitemRoutes.js";

// Model Associations
import { associateModels } from "./models/associations.js"; // Ensure associations are set up
// Import Error Handler
import errorHandler from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
// Middleware
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:8080";

app.use(
  cors({
    origin: FRONTEND_ORIGIN, // no wildcard!
    credentials: true, // <–– allows Set-Cookie and Cookie headers
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/inventories", inventoryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order-items", orderitemRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    await associateModels(); // Call the function to set up associations
    console.log("✅ All models were associated successfully.");

    // Recreate all tables from models
    await sequelize.sync();
    console.log("✅ All models were synchronized (force: true)");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
