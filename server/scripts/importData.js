const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Restaurant = require("../models/restaurant.model");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const importData = async () => {
  try {
    // Check if MongoDB URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Read the processed restaurants file
    const filePath = path.join(__dirname, "../../processed_restaurants.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(rawData);

    if (!data.restaurants || !Array.isArray(data.restaurants)) {
      throw new Error("Invalid data format: restaurants array not found");
    }

    // Transform the data to match our schema
    const transformedRestaurants = [];
    data.restaurants.forEach((restaurants) => {
      restaurants?.restaurants?.forEach((res) => {
        const restaurant = res.restaurant;
        const val = {
          restaurantId: restaurant.id || restaurant.restaurantId,
          name: restaurant.name,
          photoUrl: restaurant.thumb,
          description: restaurant.description,
          city: restaurant.location?.city,
          address: restaurant.location?.address,
          locality: restaurant.location?.locality,
          localityVerbose: restaurant.location?.locality_verbose,
          location: {
            type: "Point",
            coordinates: [
              parseFloat(restaurant.location?.longitude || 0),
              parseFloat(restaurant.location?.latitude || 0),
            ],
          },
          cuisines: restaurant.cuisines
            ? restaurant.cuisines.split(",").map((c) => c.trim())
            : [],
          averageCostForTwo: restaurant.average_cost_for_two,
          currency: restaurant.currency,
          hasTableBooking:
            restaurant.has_table_booking || restaurant.hasTableBooking || false,
          hasOnlineDelivery:
            restaurant.has_online_delivery ||
            restaurant.hasOnlineDelivery ||
            false,
          isDeliveringNow:
            restaurant.is_delivering_now || restaurant.isDeliveringNow || false,
          priceRange: restaurant.price_range || restaurant.priceRange,
          aggregateRating: restaurant.user_rating?.aggregate_rating || 3,
          ratingColor: restaurant.user_rating?.rating_color || "grey",
          ratingText: restaurant.user_rating?.rating_text || "Good",
          votes: restaurant.user_rating?.votes || 1,
        };

        transformedRestaurants.push(val);
      });
    });

    // Clear existing data
    await Restaurant.deleteMany({});

    // Insert the new data
    const result = await Restaurant.insertMany(transformedRestaurants, {
      ordered: false, // Continue inserting even if some documents fail
    });

    // Create indexes
    await Restaurant.collection.createIndex(
      { restaurantId: 1 },
      { unique: true }
    );
    await Restaurant.collection.createIndex({ location: "2dsphere" });

    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error?.message);
    process.exit(1);
  }
};

// Run the import
importData();
