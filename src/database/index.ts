import mongoose from 'mongoose';
import { DB_URI } from '../config/config';
import logger from '../config/logger';

/**
 * Establish a connection to the MongoDB database.
 * @returns {Promise<void>}
 */
export const databaseConnect = async (): Promise<void> => {
  try {
    const databaseInstance = await mongoose.connect(DB_URI, {
      dbName: 'constcode',
    });
    logger.info(
      `MongoDB Connected! DB Host: ${databaseInstance.connection.host}`
    );
  } catch (error) {
    handleDatabaseConnectionError(error);
  }
};

export const handleDatabaseConnectionError = (error: any) => {
  logger.error('MongoDB connection error: ' + error.message);
  if (error.name === 'MongoNetworkError') {
    logger.error('Network error. Check your connection.');
  }
  process.exit(1);
};
