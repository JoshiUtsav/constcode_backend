import express, { Request, Response } from "express";
import http from "http";
import Router from "./routes/routes";
import Auth from "./routes/auth";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", Router);
app.use("/auth", Auth);

app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  res.status(500).send("Something went wrong!");
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
