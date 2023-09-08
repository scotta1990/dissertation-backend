const router = require("express").Router();
const goalsController = require("../controllers/goals");

//Get all goals
router.get("/", goalsController.getAllGaols);

//Add a goal
router.post("/", goalsController.addGoal);

//Update a goal
router.put("/:id", goalsController.updateGoal);

//Get workout goal
router.get("/workout", goalsController.getWorkoutGoal);

//Get goal by a specific item
router.get("/specific", goalsController.getGoalByItemId);

//Get goal suggestion
router.get(
  "/recommendation/exercise",
  goalsController.getExerciseGoalSuggestion
);

router.get(
  "/recommendation/measurement",
  goalsController.getMeasurementGoalSuggestion
);

module.exports = router;
