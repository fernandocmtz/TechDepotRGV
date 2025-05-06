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

// Model Associations
import { associateModels } from "./models/associations.js"; // Ensure associations are set up

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

// Function to start server after ensuring DB connection
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    associateModels(); // Create model associations
    console.log("✅ Models associated successfully.");

    await sequelize.sync({ alter: true }); // ✅ Ensures tables are created
    console.log("✅ Tables synchronized.");

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit if DB connection fails
  }
}

// Start the server
startServer();
