const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  services: [String],
  location: String,
  availability: String,
  priceRange: String,
  rating: Number,
  aiAgentProfile: Object, // For Gemini agent training data
});

module.exports = mongoose.model("Vendor", vendorSchema);
