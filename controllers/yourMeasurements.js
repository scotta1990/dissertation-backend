const Measurement = require("../models/measurement");
const MeasurementType = require("../models/measurementType");

exports.getMeasurementTypes = async (req, res) => {
  console.log(`Get measurement types request made by ${req.user.userId}`);
  try {
    const measurementTypes = await MeasurementType.find();
    return res.status(200).send(measurementTypes);
  } catch (error) {
    return res.status(400).send("Error getting measurement types");
  }
};

// exports.getAllBodyMeasurements = async (req, res) => {
//   try {
//     const bodyMeasurements = await BodyMeasurement.find({
//       userId: req.user.userId,
//     });
//     return res.status(200).send(bodyMeasurements);
//   } catch (error) {
//     return res.status(400).send("Error finding body measurements");
//   }
// };

// exports.getBodyMeasurementById = async (req, res) => {
//   try {
//     const bodyMeasurements = await BodyMeasurement.findById(
//       req.params.bodyMeasurementId
//     );
//     return res.status(200).send(bodyMeasurements);
//   } catch (error) {
//     return res.status(400).send("Error trying to find body measurement");
//   }
// };

// exports.getAllBodyMeasurementsByType = async (req, res) => {
//   try {
//     const bodyMeasurements = await BodyMeasurement.find({
//       userId: req.user.userId,
//       measurementTypeId: req.params.measurementTypeId,
//     });
//     return res.status(200).send(bodyMeasurements);
//   } catch (error) {
//     return res.status(400).send("Error finding body measurements");
//   }
// };

exports.addMeasurement = async (req, res) => {
  console.log(`Add measurement request made by ${req.user.userId}`);
  //Validate the body measurement data
  if (!(req.body.measurementTypeId && req.body.value))
    return res.status(400).send("Measurement type and value are required");

  //Check that the measurement type actually exists
  try {
    const measurementTypeExists = await MeasurementType.findById(
      req.body.measurementTypeId
    );
    if (!measurementTypeExists)
      return res.status(400).send("Measurement type id is invalid");
  } catch (err) {
    return res.status(400).send("Measurement type id is invalid");
  }

  //Check if the measurement already exists for this date, and replace if so

  //Set the date for the comparison, date is set to today at midnight and ISOString for mongodb
  const queryDate = new Date();
  queryDate.setHours(0);
  queryDate.setMinutes(0);
  queryDate.setSeconds(0);

  const measurementExists = await Measurement.findOne({
    userId: req.user.userId,
    dateCreated: { $gt: queryDate.toISOString() },
    measurementTypeId: req.body.measurementTypeId,
  });

  if (measurementExists) {
    //Update the value instead if already exists in database
    try {
      const updatedMeasurement = await Measurement.updateOne(
        { _id: measurementExists._id },
        { value: req.body.value }
      );
      return res.status(200).send(updatedMeasurement);
    } catch (error) {
      return res.status(400).send("Error trying to update");
    }
  }

  //Create the new body measurement object
  const newMeasurement = new Measurement({
    measurementTypeId: req.body.measurementTypeId,
    value: req.body.value,
    userId: req.user.userId,
  });

  try {
    //Save to the db and respond
    const savedMeasurement = await newMeasurement.save();
    res.send(savedMeasurement);
  } catch (error) {
    return res.status(400).send("Error adding new body measurement");
  }
};

// exports.updateBodyMeasurement = async (req, res) => {
//   //Validate the body measurement data
//   if (!(req.body.measurementTypeId && req.body.value))
//     return res.status(400).send("Measurement type and value are required");

//   //Create the new body measurement object
//   const newBodyMeasurement = new BodyMeasurement({
//     _id: req.params.id,
//     measurementTypeId: req.body.measurementTypeId,
//     value: req.body.value,
//     userId: req.user.userId,
//   });
//   try {
//     const updatedBodyMeasurement = await BodyMeasurement.updateOne(
//       { _id: req.params.id },
//       newBodyMeasurement
//     );
//     return res.status(200).send(`${req.params.id} has been updated`);
//   } catch (error) {
//     return res.status(400).send(`Error updating ${req.params.id}`);
//   }
// };
