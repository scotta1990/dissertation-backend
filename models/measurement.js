const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema({
  measurementTypeId: {
    type: mongoose.Schema.ObjectId,
    ref: "MeasurementType",
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: new Date(),
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Measurement", measurementSchema);
