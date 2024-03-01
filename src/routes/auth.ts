import express from "express";
import { handleUserAuth } from "../controller/Index";

const Router = express.Router();

Router.post("/signup", handleUserAuth);

export default Router;
