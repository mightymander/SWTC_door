// controllers/userController.js
const { list } = require("postcss");
const User = require("../models/user");
const { get } = require("mongoose");

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

async function make_user_admin_email(email) {
  const user = await User.findOne({ email: email });
  user.admin = true;
  await user.save();
  console.log("User is now an admin");
}

async function get_all_users() {
  const users = await User.find();
  return users;
}

async function get_all_users_in_gym() {
  const users = await User.find({ inside_gym: true });
  return users;
}

async function generate_list_of_usernames_in_gym() {
  const users = await User.find({ inside_gym: true });
  const usernames = users.map((user) => user.username);
  return usernames;
}

async function generate_list_of_all_usernames() {
  const users = await User.find();
  const usernames = users.map((user) => user.username);
  return usernames;
}

async function generate_users_in_gym() {
  const users = await User.find({ inside_gym: true });
  const users_in_gym = users.map((user) => ({
    username: user.username,
    time_elapsed_inside_gym: user.time_elapsed_inside_gym, // Assuming you have this field in your database
  }));
  return users_in_gym;
}

async function update_time_elapsed_inside_gym() {
  const users = await User.find({ inside_gym: true });
  users.forEach((user) => {
    user.time_elapsed_inside_gym = Date.now() / 1000 - user.time_entered_gym;
    user.save();
  });
}

function formatTimeElapsed(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

//console log all users inside gym using lust_all_users_inside_gym
//list_all_users_inside_gym().then((result) => {
//  console.log(result);
//});

module.exports = {
  get_user_by_email,
  get_user_by_id,
  get_users,
  make_user_admin_email,
  get_all_users,
  get_all_users_in_gym,
  generate_list_of_usernames_in_gym,
  generate_list_of_all_usernames,
  generate_users_in_gym,
  update_time_elapsed_inside_gym,
  formatTimeElapsed,
};
