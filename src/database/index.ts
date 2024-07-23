import mongoose from "mongoose";
import { DATABASE_URL, DB_NAME } from "@/config/Index";

const connect_DB = async () => {
  try {
    const Database_Instance = await mongoose.connect(
      `${DATABASE_URL}/${DB_NAME}`
    );    
    
    console.log(`${DATABASE_URL}/${DB_NAME}`);
    

    console.log(
      `\nMongoDB Connected !! DB Host: ${Database_Instance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB Error: " + error);
    process.exit(1);
  }
};

export default connect_DB;
