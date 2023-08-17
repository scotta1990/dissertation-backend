const feature = require("../models/feature");
const Feature = require("../models/feature");

exports.getAllFeatures = async (req, res) => {
  console.log(
    `Get all features request made by ${
      req.user?.userId ? req.user.userId : "public"
    }`
  );
  try {
    const features = await Feature.find();
    return res.status(200).send(features);
  } catch (error) {
    return res.status(400).send("Error getting all features");
  }
};

exports.addFeature = async (req, res) => {
  console.log(`Add feature request made by ${req.user.userId}`);
  const feature = new Feature({
    name: req.body.name,
    description: req.body.description,
    createdBy: req.user.userId,
  });
  try {
    const savedFeature = await feature.save();
    res.send(savedFeature);
  } catch (error) {
    return res.status(400).send("Error adding feature: " + error);
  }
};

exports.toggleFeatureById = async (req, res) => {
  console.log(`Feature: ${req.body.id} toggle request by ${req.user.userId}`);
  try {
    const feature = await Feature.findById(req.body.id).exec();
    if (!feature) {
      return res.status(400).send("Error finding and toggling feature");
    }
    const updatedFeature = await Feature.findByIdAndUpdate(req.body.id, {
      active: !feature.active,
    });
    return res.status(200).send(updatedFeature);
  } catch (error) {
    return res.status(400).send("Error toggling feature: " + error);
  }
};
