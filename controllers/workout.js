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
