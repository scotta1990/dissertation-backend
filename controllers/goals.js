const mongoose = require("mongoose");

const Goal = require("../models/goal");
const Workout = require("../models/workout");
const Measurement = require("../models/measurement");

exports.getAllGaols = async (req, res) => {
  console.log(`Get all goals request made by ${req.user.userId}`);
  try {
    const goals = await Goal.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
    ]);
    return res.status(200).send(goals);
  } catch (error) {
    return res.status(400).send("Error getting all goals");
  }
};

exports.addGoal = async (req, res) => {
  console.log(`Add goal request made by ${req.user.userId}`);
  const goal = new Goal({
    userId: req.user.userId,
    type: req.body.type.toUpperCase(),
    itemId: req.body?.itemId,
    itemName: req.body?.itemName,
    value: req.body.value,
  });
  try {
    const savedGoal = await goal.save();
    res.send(savedGoal);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error adding goal: " + error);
  }
};

exports.updateGoal = async (req, res) => {
  console.log(
    `Update goal ${req.params.id} request made by ${req.user.userId}`
  );

  if (!req.body) {
    return res.status(400).send("No data for update provided");
  }

  try {
    const id = req.params.id;

    const goal = await Goal.findByIdAndUpdate(
      id,
      { value: req.body.value },
      {
        returnDocument: "after",
      }
    );
    return res.status(200).send(goal);
  } catch (error) {
    return res.status(400).send("Error updating goal: " + error);
  }
};

exports.getWorkoutGoal = async (req, res) => {
  console.log(`Workout goal request made by ${req.user.userId}`);
  try {
    const goal = await Goal.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
          type: "WORKOUT",
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

  if (!req.query.itemId) {
    return res.status(400).send("No goal item id provided");
  }

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

exports.getExerciseGoalSuggestion = async (req, res) => {
  console.log(
    `Exercise goal suggestion request made by ${req.user.userId} for ${req.query.itemId}`
  );
  try {
    const recommendation = await Workout.aggregate([
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
          _id: req.query.itemId,
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

    if (recommendation.length > 0) {
      recommendation[0].recommendation =
        recommendation[0].mostRecent.measurementsAvg * 1.2;
    }

    return res.status(200).send(recommendation);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error getting goal suggestion for exercise");
  }
};

exports.getMeasurementGoalSuggestion = async (req, res) => {
  console.log(
    `Measurement goal suggestion request made by ${req.user.userId} for ${req.query.itemId}`
  );
  try {
    const recommendation = await Measurement.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
          measurementTypeId: new mongoose.Types.ObjectId(req.query.itemId),
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
      {
        $project: {
          _id: 1,
          mostRecent: {
            measurementsAvg: "$value",
          },
        },
      },
    ]);

    // if (recommendation.length > 0) {
    //   recommendation[0].recommendation =
    //     recommendation[0].mostRecent.measurementsAvg * 1.2;
    // }

    return res.status(200).send(recommendation);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send("Error getting goal suggestion for measurement");
  }
};
