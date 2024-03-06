import mongoose, { Schema } from "mongoose";

const VideoFile_Schema = new Schema();

const VideoFile = mongoose.model("VideoFile", VideoFile_Schema);
export default VideoFile;
