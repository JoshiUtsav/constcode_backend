import dotenv from "dotenv";
dotenv.config();

import "module-alias/register";
import express, { Request, Response } from "express";
import cors from "cors";
import Router from "@/routes/index.route";
import { CORS_ORIGIN, PORT } from "@/config";
import {
  databaseConnect,
  handleDatabaseConnectionError,
} from "@/database/index";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api", Router);

app.use(
  (err: Error, req: Request, res: Response, next: express.NextFunction) => {
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
);

const startServer = async () => {
  try {
    await databaseConnect();
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    handleDatabaseConnectionError(error);
  }
};

startServer();
