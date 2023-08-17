const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    default: "Workout",
    enum: ["Workout", "Exercise", "Measurement"],
  },
  value: {
    type: Number,
    required: true,
    default: 0,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Goal", goalSchema);
