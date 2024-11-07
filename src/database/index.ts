import mongoose from "mongoose";
import { DB_URI } from "@/config";

/**
 * Establish a connection to the MongoDB database.
 * @returns {Promise<void>}
 */
export const databaseConnect = async () => {
  const databaseInstance = await mongoose.connect(`${DB_URI}/dashboard`);
  console.log(
    `MongoDB Connected !! DB Host: ${databaseInstance.connection.host}`
  );
};

export const handleDatabaseConnectionError = (error: any) => {
  console.error("MongoDB connection error:", error.message);
  if (error.name === "MongoNetworkError") {
    console.error("Network error. Check your connection.");
  }
  process.exit(1);
};
