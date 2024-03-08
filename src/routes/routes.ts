import express from "express";
import { Home_Page } from "@/controller/Index.controller";

const Router = express.Router();

Router.get("/", Home_Page);

export default Router;
