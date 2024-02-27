import express from "express";
import cors from "cors";
import Router from "./routes/routes";

const app = express();

app.use(cors());

app.use("/", Router);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
