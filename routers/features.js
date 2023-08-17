const router = require("express").Router();
const featureController = require("../controllers/features");

//Get all features
router.get("/", featureController.getAllFeatures);

module.exports = router;
