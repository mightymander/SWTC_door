// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAdmin,
} = require("../middlewares/authMiddleware");
const { registerUser, logoutUser } = require("../controllers/authController");
const {
  generate_list_of_usernames_in_gym,
  generate_list_of_all_usernames,
  generate_users_in_gym,
  update_time_elapsed_inside_gym,
  formatTimeElapsed,
} = require("../controllers/userController");

const router = express.Router();

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register", { message: "" });
});

router.post("/register", checkNotAuthenticated, registerUser);

router.get("/admin", checkAuthenticated, checkAdmin, async (req, res) => {
  // Await the update to ensure the time is correctly updated before rendering
  await update_time_elapsed_inside_gym();

  // Make the formatTimeElapsed function available to the EJS template
  res.locals.formatTimeElapsed = formatTimeElapsed;

  res.render("admin", {
    users_in_gym: await generate_users_in_gym(),
    all_usernames: await generate_list_of_all_usernames(),
  });
});

router.delete("/logout", logoutUser);

module.exports = router;
