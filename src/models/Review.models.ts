import mongoose from "mongoose";

const review_schema = new mongoose.Schema(
  {
    review_Id: {
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
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    review_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", review_schema);
export default Review;
