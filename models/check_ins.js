const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checkinsSchema = Schema(
  {
    username: { type: String, required: true },
    inside_gym: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const gym_user = mongoose.model("Checkins", checkinsSchema);
module.exports = gym_user;
