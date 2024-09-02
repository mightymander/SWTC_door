// controllers/userController.js
const { list } = require("postcss");
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
};
