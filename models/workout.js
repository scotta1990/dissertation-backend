const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  workoutItems: [
    {
      id: {
        type: Number,
        required: true,
      },
      exerciseId: {
        type: String,
        required: true,
      },
      sets: [
        {
          id: {
            type: Number,
            required: true,
          },
          count: {
            type: String,
          },
          measurement: {
            type: String,
          },
          done: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Workout", workoutSchema);
