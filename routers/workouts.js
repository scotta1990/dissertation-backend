const router = require("express").Router();
const workoutController = require("../controllers/workout");

//Get all workouts
router.get("/", workoutController.getAllWorkouts);

//Add a workout
router.post("/", workoutController.addWorkout);

//Get exercise data
router.get("/exercise/data", workoutController.getRecentExerciseData);

module.exports = router;
