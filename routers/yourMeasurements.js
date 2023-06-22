const router = require("express").Router();
const yourMeasurementsController = require("../controllers/yourMeasurements");

// /**
//  * @swagger
//  * tags:
//  *  name: Body Measurements
//  *  description: The body measurements management API
//  */

// /**
//  * @swagger
//  * /bodymeasurements:
//  *  get:
//  *      summary: Gets all bodymeasurements for a user
//  *      tags: [Body Measurements]
//  *      responses:
//  *          '200':
//  *              description: A successful response
//  *          '400':
//  *              description: A bad request
//  */
// router.get("/", bodyMeasurementController.getAllBodyMeasurements);

// /**
//  * @swagger
//  * /bodymeasurements/{bodyMeasurementId}:
//  *  get:
//  *      summary: Gets a body measurement by id
//  *      tags: [Body Measurements]
//  *      parameters:
//  *          - in: path
//  *            name: bodyMeasurementId
//  *            description: The id that represents the body measurement
//  *            schema:
//  *              id:
//  *                type: string
//  *      responses:
//  *          '200':
//  *              description: A successful response
//  *          '400':
//  *              description: A bad request
//  */
// router.get(
//   "/:bodyMeasurementId",
//   bodyMeasurementController.getBodyMeasurementById
// );
// router.get(
//   "/type/:measurementTypeId",
//   bodyMeasurementController.getAllBodyMeasurementsByType
// );
router.post("/", yourMeasurementsController.addMeasurement);
// router.put("/:id", bodyMeasurementController.updateBodyMeasurement);

router.get("/types", yourMeasurementsController.getMeasurementTypes);

module.exports = router;
