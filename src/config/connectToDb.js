import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_LOCAL);
    console.log("Connected To Data Base");
  } catch (error) {
    // Corrected typo: "Data Base" -> "Database"
    console.log("Connection Failed To Database", error);
  }
};

export default connectToDb;
