export const PORT = process.env.PORT || 3000;

export const DB_URI =
  process.env.DB_URI || 'mongodb://localhost:27017/courseapp';
export const API_KEY = process.env.API_KEY || 'your_api_key';

export const CORS_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN_PROD
    : process.env.CORS_ORIGIN_DEV;

export const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default_secret';
export const JWT_EXPIRES_TIME = process.env.ACCESS_TOKEN_EXPIRY || '1d';
export const JWT_REFRESH_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';
export const JWT_REFRESH_EXPIRES_TIME = process.env.JWT_REFRESH_EXPIRY || '10d';
export const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME || 'course-app';
export const CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY || '1981984871651651';
export const CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET || 'New-Secret';
