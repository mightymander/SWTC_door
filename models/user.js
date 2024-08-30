const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  inside_gym: { type: Boolean, required: true, default: false },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
