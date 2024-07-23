import { API_ERROR, ASYNC_HANDLER, API_RESPONSE } from "@/utils/Index.utils";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/config/Index";
import User_Model from "@/models/User.models";

export const verify_jwt = ASYNC_HANDLER(async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new API_ERROR(401, "Unauthorized request");
    }

    const decoded_token = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await User_Model.findById(
      decoded_token?._id.select("-password -refresh-token")
    );

    if (!user) {
      throw new API_ERROR(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new API_ERROR(401, error?.message || "Invalid access token");
  }
});
