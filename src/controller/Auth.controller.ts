import { User } from "../models/Index.models";
import { Request, Response } from "express";

async function handleUserAuth(req: Request, res: Response) {
  const { name, email, password } = req.body;
  console.log(name, email, password);
}

export default handleUserAuth;
