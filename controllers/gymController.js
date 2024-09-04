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
  user.time_entered_gym = Date.now() / 1000;
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
  user.time_entered_gym = 0;
  user.time_elapsed_inside_gym = 0;
  await user.save();

  const checkout = new GymUser({ username: username, inside_gym: false });
  await checkout.save();
  console.log("User checked out:", username);
}

module.exports = { checkin_gym, checkout_gym };
