const mongoose = require("mongoose");

mongoose
  .connect(
    process.env.DEV_ENV ? process.env.DEV_DB_CONNECT : process.env.DB_CONNECT
  )
  .then(() => console.log("Database connected"))
  .catch((err) =>
    console.log("Database connection failed: ", err.message || err)
  );
