import mongoose, { Schema } from "mongoose";

const TestPaper_Schema = new Schema();

const TestPaper = mongoose.model("TestPaper", TestPaper_Schema);
export default TestPaper;
