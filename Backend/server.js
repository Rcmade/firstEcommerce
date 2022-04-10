const app = require("./app");
// const dotenv = require("dotenv");
const connectDataBase = require("./config/database");
const cloudinary = require("cloudinary").v2;

// handling unca exceptions

process.on("uncaughtException", (err) => {
  console.log(
    "shutting down server due to unhandelr promise uncaughtException errors"
  );
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "Backend/config/config.env" });
}

// Connecting to Mongodb
connectDataBase();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const PORT = process.env.PORT || 4444
const server = app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

// unhandelr promise rejection errors

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection: " + err.message);
  console.log("shutting down server due to unhandelr promise rejection errors");
  server.close(() => {
    process.exit(1);
  });
});
