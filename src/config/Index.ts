import dotenv from "dotenv";
dotenv.config();

const DB_NAME: string = "courseapp";

const DATABASE_URL: string =
  process?.env?.DATABASE_URL || "mongodb://localhost:27017/courseapp";
const PORT: number = (process?.env?.PORT as unknown as number) || 3000;
const API_KEY: string = process?.env?.API_KEY || "your_api_key";
const CORS_ORIGIN: string = process?.env?.CORS_ORIGIN || "";
const ACCESS_TOKEN_SECRET: string =
  process?.env?.ACCESS_TOKEN_SECRET || "default_secret";
const ACCESS_TOKEN_EXPIRY: string = process?.env?.ACCESS_TOKEN_EXPIRY || "1d";
const REFRESH_TOKEN_SECRET: string =
  process?.env?.REFRESH_TOKEN_SECRET || "default_refresh_secret";
const REFRESH_TOKEN_EXPIRY: string =
  process?.env?.REFRESH_TOKEN_EXPIRY || "10d";

const CLOUDINARY_CLOUD_NAME: string =
  process.env?.CLOUDINARY_CLOUD_NAME || "course-app";

const CLOUDINARY_API_KEY: string =
  process.env?.CLOUDINARY_API_KEY || "1981984871651651";

const CLOUDINARY_API_SECRET: string =
  process.env?.CLOUDINARY_API_SECRET || "New-Secret";

export {
  PORT,
  DATABASE_URL,
  API_KEY,
  DB_NAME,
  CORS_ORIGIN,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
