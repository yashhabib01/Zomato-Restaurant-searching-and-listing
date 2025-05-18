const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const restaurantRoutes = require("./routes/restaurant.routes");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
app.use("/api/restaurants", restaurantRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Restaurant API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
