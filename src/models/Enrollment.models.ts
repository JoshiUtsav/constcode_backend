import mongoose from "mongoose";

const enrollment_schema = new mongoose.Schema(
  {
    enrollment_Id: {
      type: String,
      required: true,
      unique: true,
    },
    user_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrollment_date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Enrollment = mongoose.model("Enrollment", enrollment_schema);
export default Enrollment;
