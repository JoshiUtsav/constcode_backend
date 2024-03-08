import dotenv from "dotenv";
dotenv.config();

const DB_NAME: string = "course-app";

const PORT = process?.env?.PORT || 3000;
const DATABASE_URL =
  process?.env?.DATABASE_URL || "mongodb://localhost:27017/my_database";
const API_KEY = process?.env?.API_KEY || "your_api_key";
const CORS_ORIGIN = process?.env?.CORS_ORIGIN || "";
const ACCESS_TOKEN_SECRET = process?.env?.ACCESS_TOKEN_SECRET || "";
const ACCESS_TOKEN_EXPIRY = process?.env?.ACCESS_TOKEN_EXPIRY || "1d";
const REFRESH_TOKEN_SECRET = process?.env?.REFRESH_TOKEN_SECRET || "";
const REFRESH_TOKEN_EXPIRY = process?.env?.REFRESH_TOKEN_EXPIRY || "10d";

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
};
