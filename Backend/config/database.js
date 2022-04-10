const mongoose = require("mongoose");

const connectDataBase = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((data) => {
      console.log(`Connected to MongoDb , Host : ${data.connection.host}`);
    })
    // .catch((err) => console.log("err mongodb connect err", err));
};

module.exports = connectDataBase;
