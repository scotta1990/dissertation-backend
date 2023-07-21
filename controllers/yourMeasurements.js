const mongoose = require("mongoose");

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

exports.getMeasurementsProfile = async (req, res) => {
  console.log(`Get measurements profile request made by ${req.user.userId}`);
  try {
    const measurements = await Measurement.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: "$measurementTypeId",
          measurements: {
            $lastN: {
              // input: ["$dateCreated", "$value"],
              input: { dateCreated: "$dateCreated", value: "$value" },
              n: 2,
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          measurementTypeId: "$_id",
          measurements: "$measurements",
        },
      },
    ]);
    return res.status(200).send(measurements);
  } catch (error) {
    return res.status(400).send("Error getting measurement profile for user");
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

// exports.getBodyMeasurementsByType = async (req, res) => {
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

exports.getRecentBodyMeasurementsByType = async (req, res) => {
  // Returns data for the measurementType provided for the last 42 days
  console.log(
    `Get measurements for type ${req.query.measurementTypeId} request made by ${req.user.userId}`
  );

  //Create the lower bound date to based on the weeks value
  const weeks = 4;
  const lowerBoundDate = new Date();
  const day = lowerBoundDate.getDate() - 7 * weeks;
  lowerBoundDate.setDate(day);

  try {
    const measurements = await Measurement.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
          measurementTypeId: new mongoose.Types.ObjectId(
            req.query.measurementTypeId
          ),
        },
      },
      {
        $addFields: {
          DateString: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$dateCreated",
            },
          },
        },
      },
      {
        $addFields: {
          Date: {
            $dateFromString: {
              dateString: "$DateString",
            },
          },
        },
      },
      {
        $densify: {
          field: "Date",
          range: {
            step: 1,
            unit: "day",
            bounds: [lowerBoundDate, new Date()],
          },
        },
      },
      {
        $addFields: {
          DateString: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$Date",
            },
          },
        },
      },
      {
        $sort: {
          Date: 1,
        },
      },
    ]);
    return res.status(200).send(measurements);
  } catch (error) {
    return res.status(400).send("Error getting measurements for user");
  }
};

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
