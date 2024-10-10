const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

// CORS settings
const corsOptions = {
  origin: [
    "http://localhost:3000", // For local development
    "https://thriftclient.vercel.app", // For production client
  ],
  credentials: true, // Allow credentials (cookies, etc.)
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Test route
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

// Environment-based config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");

// Use routes
app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);

// WebSocket connection check (avoid localhost in production)
if (process.env.NODE_ENV === "PRODUCTION") {
  // Use production WebSocket server (adjust as necessary)
  console.log("Running in production mode");
  // Additional production-specific logic if needed
}

// Error handling middleware
app.use(ErrorHandler);

module.exports = app;
