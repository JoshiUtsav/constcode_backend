import express from "express";
import cors from "cors";
import Router from "./routes/routes";
import https from "https";

const app = express();
const server = https.createServer(app);

app.use(cors());

app.use("/", Router);

server.listen(3000, () => {
  console.log("listening on port 3000");
});
