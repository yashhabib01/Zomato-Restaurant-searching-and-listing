const express = require("express");
const router = express.Router();
const {
  getRestaurantById,
  getRestaurants,
} = require("../controllers/restaurant.controller");

// Get restaurant by ID
router.get("/:id", getRestaurantById);

// Get list of restaurants with pagination
router.get("/", getRestaurants);

module.exports = router;
