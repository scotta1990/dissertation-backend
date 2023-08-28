const router = require("express").Router();
const exercisesController = require("../controllers/exercises");

router.get("/", exercisesController.getExercises);

module.exports = router;
