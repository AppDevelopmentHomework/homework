import { Schema, model } from "mongoose";

// User model schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String },
  lastname: { type: String },
});

const User = model("User", userSchema);

export default User;