import { Request, Response } from "express";
import User_Model from "@/models/User.models";
import bcrypt from "bcrypt";

async function handleUserSignup(req: Request, res: Response) {
  const { name, email, password, phoneNumber } = req.body;

  try {
    const addUser = new User_Model({
      username: name,
      email: email,
      password: password,
      number: phoneNumber,
    });

    const user = await addUser.save();
    res.status(201).json({
      username: user.username,
      email: user.email,
      number: user.number,
    });
  } catch (error) {
    console.error("Error while saving the user:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function handleUserLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  console.log(email, password);
}

export default handleUserSignup;
