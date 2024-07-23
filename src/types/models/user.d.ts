import { Document } from "mongoose";

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  number: string;
  watchHistory?: Types.ObjectId[];
  refreshToken?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export default UserDocument;
