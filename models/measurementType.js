const mongoose = require("mongoose");

const measurementTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  metric: {
    type: String,
    required: true,
  },
  orderId: {
    type: Number,
  },
});

module.exports = mongoose.model("MeasurementType", measurementTypeSchema);
