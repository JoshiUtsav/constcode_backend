import { Request, Response } from "express";

async function handleUserAuth(req: Request, res: Response) {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  res.send(name);
}

export default handleUserAuth;
