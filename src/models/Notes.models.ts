import mongoose, { Schema } from "mongoose";

const Notes_Schema = new Schema();

const Notes = mongoose.model("Notes", Notes_Schema);
export default Notes;
