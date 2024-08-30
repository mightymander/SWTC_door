// config/database.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI;
    console.log("Attempting Connection to db...");
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to database");
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
