const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  countryCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  countryName: {
    type: String,
    required: true,
  },
});

const Country = mongoose.model("Country", countrySchema);

module.exports = Country;
