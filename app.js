const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRouter = require("./routers/user");
const yourMeasurementsRouter = require("./routers/yourMeasurements");
const workoutsRouter = require("./routers/workouts");
const goalsRouter = require("./routers/goals");
const featuresAdminRouter = require("./routers/featuresAdmin");
const featuresRouter = require("./routers/features");
const exercisesRouter = require("./routers/exercises");
const auth = require("./middleware/auth");
const roleRestriction = require("./middleware/roleRestriction");
//Create express app
const app = express();

//Set up the swagger documentation
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    // openapi: "3.0.3",
    info: {
      title: "Fitness App Api",
      description: "The fitness tracking and goal setting API for mobile",
      contact: {
        name: "Scott Adams",
      },
    },
    basePath: "/api",
    securityDefinitions: {
      AccessToken: {
        type: "apiKey",
        name: "x-access-token",
        scheme: "bearer",
        in: "header",
        description: "The token for authentication",
      },
    },
    security: [{ AccessToken: [] }],
    tags: [
      {
        name: "User",
        description: "For registering and logging in as a user",
      },
    ],
  },
  apis: ["./routers/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Set up environment variable file
require("dotenv").config();

//Connect to Database
require("./db");

//Add middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

//Add health point
app.get("/health", (req, res) => {
  res.status(200).send("Success");
});
app.get("/", (req, res) => {
  res.status(200).send("Index");
});

//Add router middleware
app.use("/api/user", userRouter);
app.use(
  "/api/bodyMeasurementType",
  auth.verifyToken,
  roleRestriction.rolePermissions(["Admin"])
); //need to write the router and controller
app.use("/api/workouts", auth.verifyToken, workoutsRouter);
app.use("/api/yourMeasurements", auth.verifyToken, yourMeasurementsRouter);
app.use("/api/goals", auth.verifyToken, goalsRouter);
app.use("/api/exercises", auth.verifyToken, exercisesRouter);
app.use(
  "/api/features/admin",
  auth.verifyToken,
  roleRestriction.rolePermissions(["Admin"]),
  featuresAdminRouter
);
app.use("/api/features", featuresRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `${
      process.env.DEV_ENV
        ? "DEV ENVIRONMENT RUNNING"
        : "PROD ENVIRONMENT RUNNING"
    }`
  );
  console.log(`Port is listening on ${process.env.PORT}`);
});
