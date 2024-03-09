import dotenv from "dotenv";
dotenv.config();

const DB_NAME: string = "course-app";

const PORT: number = parseInt(process?.env?.PORT as string, 10) || 3000;
const DATABASE_URL: string =
  process?.env?.DATABASE_URL || "mongodb://localhost:27017/my_database";
const API_KEY: string = process?.env?.API_KEY || "your_api_key";
const CORS_ORIGIN: string = process?.env?.CORS_ORIGIN || "";
const ACCESS_TOKEN_SECRET: string =
  process?.env?.ACCESS_TOKEN_SECRET || "default_secret";
const ACCESS_TOKEN_EXPIRY: string = process?.env?.ACCESS_TOKEN_EXPIRY || "1d";
const REFRESH_TOKEN_SECRET: string =
  process?.env?.REFRESH_TOKEN_SECRET || "default_refresh_secret";
const REFRESH_TOKEN_EXPIRY: string =
  process?.env?.REFRESH_TOKEN_EXPIRY || "10d";

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
