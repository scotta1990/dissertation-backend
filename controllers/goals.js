const mongoose = require("mongoose");

const Goal = require("../models/goal");
const Workout = require("../models/workout");

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
    itemId: req.body?.itemId,
    itemName: req.body?.itemName,
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

exports.getGoalByItemId = async (req, res) => {
  console.log(
    `Goal for item ${req.query.itemId} request made by ${req.user.userId}`
  );

  try {
    const goalData = await Goal.aggregate([
      {
        $match: {
          itemId: req.query.itemId,
        },
      },
    ]);

    return res.status(200).send(goalData);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error getting specific goal for item");
  }
};

exports.getGoalSuggestion = async (req, res) => {
  console.log(
    `${req.body.type} goal suggestion request made by ${req.user.userId} for ${req.body.itemId}`
  );

  if (type === "exercise") {
    try {
      const recentExercise = await Workout.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.user.userId),
          },
        },
        {
          $unwind: {
            path: "$workoutItems",
          },
        },
        {
          $group: {
            _id: "$workoutItems.exerciseId",
            exerciseData: {
              $push: {
                date: "$startDate",
                measurementsAvg: {
                  $avg: {
                    $map: {
                      input: "$workoutItems.sets.measurement",
                      as: "data",
                      in: {
                        $convert: {
                          input: "$$data",
                          to: "int",
                          onError: 0,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $match: {
            _id: req.body.itemId,
          },
        },
        {
          $addFields: {
            mostRecent: {
              $last: "$exerciseData",
            },
          },
        },
        {
          $project: {
            _id: 1,
            mostRecent: 1,
          },
        },
      ]);

      return res.status(200).send(recentExercise);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Error getting goal suggestion for exercise");
    }
  }
};
