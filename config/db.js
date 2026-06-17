const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.URI;

    if (!uri) {
      throw new Error("Missing URI in .env file");
    }

    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;