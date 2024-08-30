// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/authMiddleware");
const { registerUser, logoutUser } = require("../controllers/authController");

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

router.delete("/logout", logoutUser);

module.exports = router;
