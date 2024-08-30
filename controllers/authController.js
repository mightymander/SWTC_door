// controllers/authController.js
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { get_user_by_email } = require("../controllers/userController");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const existingEmailUser = await get_user_by_email(email);
  const existingUsernameUser = await User.findOne({ username });

  if (existingEmailUser && existingUsernameUser) {
    console.log("Email and username already exist");
    return res.render("register", {
      message: "Email and username already exist",
    });
  } else if (existingEmailUser) {
    console.log("Email already exists");
    return res.render("register", { message: "Email already exists" });
  } else if (existingUsernameUser) {
    console.log("Username already exists");
    return res.render("register", { message: "Username already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    res.redirect("/register");
  }
};

const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.redirect("/login");
  });
};

module.exports = { registerUser, logoutUser };
