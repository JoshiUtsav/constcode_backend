import mongoose, { Schema } from "mongoose";

const Course_Schema = new Schema(
  {
    course_Id: {
      type: String,
      required: true,
      unique: true,
    },
    video_file: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    Title: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", Course_Schema);
export default Course;
