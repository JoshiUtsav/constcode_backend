import mongoose from "mongoose";
import { DATABASE_URL, DB_NAME } from "@/config/Index";

const connect_DB = async () => {
  try {
    const Database_Instance = await mongoose.connect(
      `${DATABASE_URL}/${DB_NAME}?retryWrites=true&w=majority&appName=course-app`
    );    
    
    console.log(
      `\nMongoDB Connected !! DB Host: ${Database_Instance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB Error: " + error);
    process.exit(1);
  }
};

export default connect_DB;
