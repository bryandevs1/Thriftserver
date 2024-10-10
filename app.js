const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

// CORS settings with additional headers
const corsOptions = {
  origin: [
    "http://localhost:3000", // Local development
    "https://thriftclient.vercel.app", // Production client
  ],
  credentials: true, // Allow credentials (cookies, etc.)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Allowed headers
  exposedHeaders: ["Content-Length", "X-Kuma-Revision"], // Headers exposed to the browser
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Test route
app.use("/test", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
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

// Explicitly set Access-Control-Allow-Headers and Access-Control-Allow-Methods if needed
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // Allow preflight (OPTIONS) requests for CORS
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// WebSocket connection check (avoid localhost in production)
if (process.env.NODE_ENV === "PRODUCTION") {
  console.log("Running in production mode");
  // Additional production-specific logic if needed
}

// Error handling middleware
app.use(ErrorHandler);

module.exports = app;
