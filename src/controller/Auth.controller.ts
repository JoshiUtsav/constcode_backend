import { Request, Response } from "express";
import type { UserDocument } from "@/types/models/Index.d";
import User_Model from "@/models/User.models";
import { API_ERROR, ASYNC_HANDLER, API_RESPONSE } from "@/utils/Index.utils";
import bcrypt from "bcrypt";

const handleUserSignup = ASYNC_HANDLER(async (req: Request, res: Response) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    const User = new User_Model({
      username: name,
      email: email,
      password: password,
      number: phoneNumber,
    });

    if (
      [name, email, password, phoneNumber].some((field) => field?.trim() === "")
    ) {
      throw new API_ERROR(400, "All fields are requied");
    }

    const existed_user = await User_Model.findOne({
      $or: [{ email: email }, { username: name }],
    });

    if (existed_user) {
      throw new API_ERROR(400, "User already exists");
    }

    const user = await User.save();

    const created_user = await User_Model.findById(user.id).select(
      "-password -refreshToken"
    );

    if (!created_user) {
      throw new API_ERROR(500, "Something went wrong while signing up");
    }

    return res
      .status(201)
      .json(
        new API_RESPONSE(200, created_user, "User Registered successfully")
      );
  } catch (error) {
    console.error("Error while registering the user:", error);
    res.status(500).send("Internal Server Error");
  }
});

export const handleUserLogin = ASYNC_HANDLER(
  async (req: Request, res: Response) => {
    const { email, password, phoneNumber } = req.body;

    if (!email) {
      throw new API_ERROR(400, "Email is required");
    }

    try {
      const user = await User_Model.findOne({ email: email });

      if (!user) {
        throw new API_ERROR(404, "User not found");
      }
      const isPasswordValid = await user.isPasswordCorrect(password);
      if (!isPasswordValid) {
        throw new API_ERROR(401, "Invalid user credentials");
      }

      const { access_token, refresh_token } =
        await generate_access_and_refresh_token(user._id);

      const loggedIn = await User_Model.findById(user._id).select(
        "-password -refresh-token"
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", access_token, options)
        .cookie("refreshToken", refresh_token, options)
        .json(
          new API_RESPONSE(
            200,
            {
              user: loggedIn,
              access_token,
              refresh_token,
            },
            "User logged in successfully"
          )
        );
    } catch (error) {
      console.error("Error while login the user:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

const log_out = ASYNC_HANDLER(async (req: Request, res: Response) => {
  
});

const generate_access_and_refresh_token = async (user_id: string) => {
  try {
    const user = (await User_Model.findById(user_id)) as UserDocument;

    if (!user) {
      throw new API_ERROR(404, "User not found");
    }

    const access_token = user.generateAccessToken();
    const refresh_token = user.generateRefreshToken();

    user.refreshToken = refresh_token;
    await user.save({ validateBeforeSave: false });

    return { access_token, refresh_token };
  } catch (error) {
    throw new API_ERROR(
      500,
      "Something went wrong while generating refresh token"
    );
  }
};

export default handleUserSignup;
