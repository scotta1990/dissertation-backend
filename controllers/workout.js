const mongoose = require("mongoose");

const Workout = require("../models/workout");

//Get all workouts
exports.getAllWorkouts = async (req, res) => {
  console.log(`Get all workouts request made by ${req.user.userId}`);
  try {
    const workouts = await Workout.find({
      userId: req.user.userId,
    });
    return res.status(200).send(workouts);
  } catch (error) {
    return res.status(400).send("Error finding workouts");
  }
};

//Add new workout
exports.addWorkout = async (req, res) => {
  console.log(`Add workouts request made by ${req.user.userId}`);
  const workout = new Workout({
    userId: req.user.userId,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    duration: req.body.duration,
    workoutItems: req.body.workoutItems,
  });
  try {
    const savedWorkout = await workout.save();
    res.send(savedWorkout);
  } catch (error) {
    return res.status(400).send("Error adding workout: " + error);
  }
};

//Get exercise data
exports.getRecentExerciseData = async (req, res) => {
  console.log(`Get recent exercise data request made by ${req.user.userId}`);
  try {
    const exerciseData = await Workout.aggregate([
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
              DateString: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$startDate",
                },
              },
              displaySets: "$workoutItems.sets",
              counts: {
                $map: {
                  input: "$workoutItems.sets.count",
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
              measurements: {
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
              value: {
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
    ]);
    console.log(exerciseData);
    return res.status(200).send(exerciseData);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error getting recent exercise data");
  }
};
