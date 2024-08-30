// controllers/userController.js
const User = require("../models/user");

async function get_user_by_email(email) {
  try {
    const user = await User.findOne({ email: email });
    console.log("User found: ", user);
    return user;
  } catch (e) {
    console.log(e);
  }
}

async function get_user_by_id(id) {
  const user = await User.findById(id);
  return user;
}

async function get_users() {
  const users = await User.find();
  console.log(users);
}

module.exports = { get_user_by_email, get_user_by_id, get_users };
