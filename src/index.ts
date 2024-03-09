import "module-alias/register";
import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import Router from "./routes/routes";
import Auth from "./routes/auth.routes";
import { PORT, CORS_ORIGIN } from "@/config/Index";
import Database from "./database/index";
import cookieParser from "cookie-parser";
import Docs from "./routes/swagger.routes";

const app = express();
const server = http.createServer(app);

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

app.use("/", Router);
app.use("/auth", Auth);
app.use("/docs", Docs);

app.use(
  (err: Error, req: Request, res: Response, next: express.NextFunction) => {
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
);

Database()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection failed: " + err);
  });
