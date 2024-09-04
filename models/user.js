const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    inside_gym: { type: Boolean, required: true, default: false },
    time_entered_gym: { type: Number, required: false, default: null },
    time_elapsed_inside_gym: { type: Number, required: true, default: 0 },
    is_admin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
