import { Document } from "mongoose";

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  number: string;
  refreshToken?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export default UserDocument;
