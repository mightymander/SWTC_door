// controllers/gymController.js
const User = require("../models/user");
const GymUser = require("../models/check_ins");

async function checkin_gym(username) {
  const user = await User.findOne({ username: username });
  if (user.inside_gym) {
    console.log("User already inside gym");
    return;
  }

  user.inside_gym = true;
  await user.save();

  const checkin = new GymUser({ username: username, inside_gym: true });
  await checkin.save();
  console.log("User checked in:", username);
}

async function checkout_gym(username) {
  const user = await User.findOne({ username: username });
  if (!user.inside_gym) {
    console.log("User already outside gym");
    return;
  }

  user.inside_gym = false;
  await user.save();

  const checkout = new GymUser({ username: username, inside_gym: false });
  await checkout.save();
  console.log("User checked out:", username);
}

module.exports = { checkin_gym, checkout_gym };
