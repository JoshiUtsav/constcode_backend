import { Document } from "mongoose";

interface UserDocument extends Document {
  userId: string;
  username: string;
  email: string;
  avatar?: string;
  password: string;
  number: string;
  watchHistory?: Types.ObjectId[];
  refreshToken?: string;
}

export default UserDocument;