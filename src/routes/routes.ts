import express, { Request, Response } from "express";

const Router = express.Router();

Router.get("/", (req: Response, res: Request) => {
  res.send("Home page");
});

export default Router;
