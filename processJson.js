const fs = require("fs");
const path = require("path");

// Array of file paths to process
const filePaths = [
  "file1.json",
  "file2.json",
  "file3.json",
  "file4.json",
  "file5.json",
];

// Function to examine JSON structure
const examineJsonStructure = (filePath) => {
  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(rawData);

    console.log(`\nExamining structure of ${filePath}:`);
    console.log("Top level keys:", Object.keys(data));

    // If it's an array, show first item structure
    if (Array.isArray(data)) {
      console.log("Data is an array with length:", data.length);
      if (data.length > 0) {
        console.log("First item keys:", Object.keys(data[0]));
      }
    }

    return data;
  } catch (error) {
    console.error(`Error examining ${filePath}:`, error.message);
    return null;
  }
};

// Function to check if an object is the error message we want to exclude
const isErrorObject = (obj) => {
  return (
    obj.message === "API limit exceeded" &&
    obj.code === 440 &&
    obj.status === ""
  );
};

// Function to process a single JSON file
const processFile = (filePath) => {
  try {
    const data = examineJsonStructure(filePath);
    if (!data) return [];

    // Handle both array and object structures
    let restaurants = [];
    if (Array.isArray(data)) {
      restaurants = data;
    } else if (data.restaurants) {
      restaurants = data.restaurants;
    } else {
      console.log(`No restaurants data found in ${filePath}`);
      return [];
    }

    console.log(`Found ${restaurants.length} restaurants in ${filePath}`);

    // Filter out error objects and return only valid restaurant data
    const validRestaurants = restaurants.filter(
      (restaurant) => !isErrorObject(restaurant)
    );
    console.log(
      `After filtering, ${validRestaurants.length} valid restaurants remain in ${filePath}`
    );

    return validRestaurants;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return [];
  }
};

// Main processing function
const processAllFiles = () => {
  const allRestaurants = new Set(); // Using Set to automatically handle duplicates
  const seenIds = new Set(); // To track unique restaurant IDs

  filePaths.forEach((filePath) => {
    console.log(`\nProcessing ${filePath}...`);
    const restaurants = processFile(filePath);

    restaurants.forEach((restaurant) => {
      // Create a unique identifier for each restaurant
      const restaurantId = restaurant.id || JSON.stringify(restaurant);

      // Only add if we haven't seen this restaurant before
      if (!seenIds.has(restaurantId)) {
        seenIds.add(restaurantId);
        allRestaurants.add(JSON.stringify(restaurant));
      }
    });
  });

  // Convert Set back to array of objects
  const uniqueRestaurants = Array.from(allRestaurants).map((str) =>
    JSON.parse(str)
  );

  // Create the final output object
  const output = {
    restaurants: uniqueRestaurants,
  };

  // Write to output file
  fs.writeFileSync(
    "processed_restaurants.json",
    JSON.stringify(output, null, 2),
    "utf8"
  );

  console.log(
    `\nProcessing complete! Found ${uniqueRestaurants.length} unique restaurants.`
  );
  console.log("Results saved to processed_restaurants.json");
};

// Run the script
processAllFiles();
