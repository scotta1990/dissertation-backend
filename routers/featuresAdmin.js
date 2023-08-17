const router = require("express").Router();
const featureController = require("../controllers/features");

//Get all features
router.get("/", featureController.getAllFeatures);

//Add a feature
router.post("/", featureController.addFeature);

//Toggle a feature
router.post("/toggle", featureController.toggleFeatureById);

module.exports = router;
