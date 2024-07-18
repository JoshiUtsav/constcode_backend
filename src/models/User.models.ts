import mongoose, { Schema, CallbackError } from "mongoose";
import bcrypt from "bcrypt";
import type { UserDocument } from "@/types/models/Index.d";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET} from "@/config/Index";

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    number: {
      type: String,
      // required: [true, "Number is required"],
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(
  "save",
  async function (
    this: UserDocument,
    next: (err?: CallbackError | undefined) => void
  ) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
);

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Generates an access token for the user.
 * @returns A JSON Web Token with the user's _id, email, and username.
 */
userSchema.methods.generateAccessToken = function (this: UserDocument): string {
  const { userId, email, username } = this;
  return jwt.sign({ _id: userId, email, username }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};
/**
 * Generates a refresh token for the user.
 * @returns A refresh token string that can be used to generate a new access token.
 */
userSchema.methods.generateRefreshToken = function (this: UserDocument): string {
  return jwt.sign(
    {
      _id: this._id as string, // Explicitly state that _id is a string
    },
    REFRESH_TOKEN_SECRET as string, // Explicitly state that REFRESH_TOKEN_SECRET is a string
    {
      expiresIn: REFRESH_TOKEN_EXPIRY as string, // Explicitly state that REFRESH_TOKEN_EXPIRY is a string
    }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
