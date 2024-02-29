import mongoose from "mongoose";

const transaction_schema = new mongoose.Schema(
  {
    Transaction_Id: {
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
    transaction_date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "PURCHASED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transaction_schema);
export default Transaction;
