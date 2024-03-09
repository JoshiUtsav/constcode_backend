import { Request, Response } from "express";
import User from "@/models/User.models";

async function handleUserAuth(req: Request, res: Response) {
  const { id, name, email, password, phoneNumber } = req.body;
  try {
    const newUser = new User({
      userId: id,
      username: name,
      email,
      password,
      number: phoneNumber,
    });
    const savedUser = await newUser.save();
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Internal Server Error");
  }
  console.log(req.body);
  res.send(name);
}

export default handleUserAuth;
