import { connect } from "mongoose";
import "dotenv/config";

const uri = process.env.MONGODB_URI;

async function connectToDatabase() {
  try {
    await connect(uri);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectToDatabase;
