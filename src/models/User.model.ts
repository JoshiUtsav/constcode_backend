import mongoose, { Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  JWT_SECRET,
  JWT_EXPIRES_TIME,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_TIME,
} from '@/config/config';
import type { UserDocument } from '@/types/models/Index';

const userSchema = new Schema<UserDocument>(
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
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    number: {
      type: String,
      required: [true, 'Number is required'],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(
  'save',
  async function (
    this: UserDocument,
    next: (err?: CallbackError | undefined) => void
  ) {
    if (!this.isModified('password')) return next();
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
  const { email, username } = this;
  return jwt.sign({ _id: this._id, email, username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_TIME,
  });
};

/**
 * Generates a refresh token for the user.
 * @returns A refresh token string that can be used to generate a new access token.
 */
userSchema.methods.generateRefreshToken = function (
  this: UserDocument
): string {
  return jwt.sign(
    {
      _id: this._id as string,
    },
    JWT_REFRESH_EXPIRES_TIME as string,
    {
      expiresIn: JWT_REFRESH_SECRET as string,
    }
  );
};

const User = mongoose.model<UserDocument>('user', userSchema);
export default User;
