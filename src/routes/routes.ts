import express, { Request, Response } from "express";

const Router = express.Router();

Router.get("/", (req: Request, res: Response) => {
  res.send("Home page");
});

export default Router;
