const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: "WORKOUT",
      enum: ["WORKOUT", "EXERCISE", "MEASUREMENT"],
    },
    itemId: {
      type: String,
      required: false,
    },
    itemName: {
      type: String,
      required: false,
    },
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
