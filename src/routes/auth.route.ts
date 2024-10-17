import express from "express";
import handleUserSignup, {
  handleUserLogin,
} from "@/controller/auth.controller";
// import { verify_jwt } from "@/middleware/auth.middleware";

const Router = express.Router();

Router.post("/signup", handleUserSignup);
Router.post("/login", handleUserLogin);

// secured route
Router.post("/logout",handleUserLogin);

export default Router;
