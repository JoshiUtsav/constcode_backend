import dotenv from 'dotenv';
dotenv.config();

import 'module-alias/register';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import routes from '@/routes/index.route';
import { CORS_ORIGIN, PORT } from '@/config/config';
import {
  databaseConnect,
  handleDatabaseConnectionError,
} from '@/database/index';
import logger from '@/config/logger';
import errorHandler from '@/middleware/errorHandler';

const app = express();

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api', routes);

// Error handling middleware
app.use(
  (err: Error, req: Request, res: Response, next: express.NextFunction) => {
    logger.error(`Internal Server Error: ${err.message}`); // Log the error
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
);

const startServer = async () => {
  try {
    await databaseConnect();
    app.listen(PORT, () => {
      logger.info(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    handleDatabaseConnectionError(error);
    logger.error(`Database connection error: ${(error as Error).message}`);
  }
};

startServer();
