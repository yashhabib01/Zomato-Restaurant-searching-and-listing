const Restaurant = require("../models/restaurant.model");

// Get restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      restaurantId: req.params.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching restaurant",
      error: error.message,
    });
  }
};

// Get list of restaurants with pagination and filters
const getRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Get search parameters
    const { latitude, longitude, radius = 3000, name, cuisines } = req.query;

    // Build aggregation pipeline
    const pipeline = [];

    // Add location-based search if coordinates are provided
    if (latitude && longitude) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          maxDistance: parseInt(radius),
          spherical: true,
        },
      });
    }

    const matchConditions = {};

    if (name) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: name, $options: "i" } },
            { description: { $regex: name, $options: "i" } },
          ],
        },
      });
    }

    if (cuisines) {
      const cuisineList = cuisines.split(",").map((c) => c.trim());
      matchConditions.cuisines = { $in: cuisineList };
    }
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Execute aggregation
    const restaurants = await Restaurant.aggregate(pipeline);

    // Get total count
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "total" });
    const countResult = await Restaurant.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: restaurants,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getRestaurantById,
  getRestaurants,
};
