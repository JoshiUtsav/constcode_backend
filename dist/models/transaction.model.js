"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_schema = new mongoose_1.default.Schema({
    transaction_Id: {
        type: String,
        required: true,
        unique: true,
    },
    user_Id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course_Id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
const Transaction = mongoose_1.default.model("transaction", transaction_schema);
exports.default = Transaction;
