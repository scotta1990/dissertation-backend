const router = require("express").Router();
const workoutController = require("../controllers/workout");

//Get all workouts
router.get("/", workoutController.getAllWorkouts);

//Add a workout
router.post("/", workoutController.addWorkout);

module.exports = router;
