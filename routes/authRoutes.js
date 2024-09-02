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
  res.render("admin", {
    usernames_in_gym: await generate_list_of_usernames_in_gym(),
    all_usernames: await generate_list_of_all_usernames(),
  });
});

router.delete("/logout", logoutUser);

module.exports = router;
