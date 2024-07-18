import express from "express";
import { handleUserSignup, handleUserLogin } from "../controller/Index.controller";

const Router = express.Router();

Router.post("/signup", handleUserSignup);
Router.post("/login", handleUserLogin);

export default Router;
