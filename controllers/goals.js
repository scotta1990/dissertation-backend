const mongoose = require("mongoose");

const Goal = require("../models/goal");

exports.getAllGaols = async (req, res) => {
  console.log(`Get all goals request made by ${req.user.userId}`);
  try {
    const goals = await Goal.find();
    return res.status(200).send(goals);
  } catch (error) {
    return res.status(400).send("Error getting all goals");
  }
};

exports.addGoal = async (req, res) => {
  console.log(`Add goal request made by ${req.user.userId}`);
  const goal = new Goal({
    userId: req.user.userId,
    type: req.body.type,
    value: req.body.value,
  });
  try {
    const savedGoal = await goal.save();
    res.send(savedGoal);
  } catch (error) {
    return res.status(400).send("Error adding goal: " + error);
  }
};

exports.getWorkoutGoal = async (req, res) => {
  console.log(`Workout goal request made by ${req.user.userId}`);
  try {
    const goal = await Goal.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
          type: "Workout",
        },
      },
      {
        $sort: {
          dateCreated: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);
    return res.status(200).send(goal);
  } catch (error) {
    return res.status(400).send("Error getting workout goals: " + error);
  }
};
