const router = require("express").Router();
const goalsController = require("../controllers/goals");

//Get all goals
router.get("/", goalsController.getAllGaols);

//Add a goal
router.post("/", goalsController.addGoal);

//Get workout goal
router.get("/workout", goalsController.getWorkoutGoal);

module.exports = router;
