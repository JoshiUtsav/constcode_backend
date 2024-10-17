import "module-alias/register";
import express, { Request, Response } from "express";
import cors from "cors";
import Router from "@/routes/index.route";
import { PORT, CORS_ORIGIN } from "@/config/Index";
import Database from "@/database/index";
import cookieParser from "cookie-parser";
import { errorHandler } from "@/utils/error_handler.utils";

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
app.use(errorHandler);

app.use("/api", Router);

app.use(
  (err: Error, req: Request, res: Response, next: express.NextFunction) => {
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
);

Database()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection failed: " + err);
  });
