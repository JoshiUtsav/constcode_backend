import express from "express";
import { handleUserAuth } from "../controller/Index.controller";

const Router = express.Router();

Router.post("/signup", handleUserAuth);

export default Router;
