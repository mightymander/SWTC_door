// routes/gymRoutes.js
const express = require("express");
const { checkAuthenticated } = require("../middlewares/authMiddleware");
const { checkin_gym, checkout_gym } = require("../controllers/gymController");

const router = express.Router();

router.get("/", checkAuthenticated, (req, res) => {
  res.render("index", {
    name: req.user.username,
    inside_gym: req.user.inside_gym,
  });
});

// Add routes for checking in and out of the gym
router.post("/checkin", checkAuthenticated, (req, res) => {
  const username = req.user.username;
  checkin_gym(username);
  res.redirect("/");
});

router.post("/checkout", checkAuthenticated, (req, res) => {
  const username = req.user.username;
  checkout_gym(username);
  res.redirect("/");
});

module.exports = router;
