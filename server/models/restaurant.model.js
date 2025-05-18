const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    locality: {
      type: String,
    },
    localityVerbose: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    cuisines: {
      type: [String],
      required: true,
    },
    averageCostForTwo: {
      type: Number,
    },
    currency: {
      type: String,
    },
    hasTableBooking: {
      type: Boolean,
      default: false,
    },
    hasOnlineDelivery: {
      type: Boolean,
      default: false,
    },
    isDeliveringNow: {
      type: Boolean,
      default: false,
    },
    priceRange: {
      type: Number,
    },
    aggregateRating: {
      type: Number,
    },
    ratingColor: {
      type: String,
    },
    ratingText: {
      type: String,
    },
    votes: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index for location-based queries
restaurantSchema.index({ location: "2dsphere" });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
