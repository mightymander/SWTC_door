const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bcrpyt = require("bcrypt");
const User = require("./models/user");
const gym_user = require("./models/check_ins");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const { get } = require("http");
require("dotenv").config();

//initialize passport which is used for authentication
const initializePassport = require("./config/passport-config");
const { error } = require("console");
initializePassport(passport, get_user_by_email, get_user_by_id);

//express app
const app = express();
const server = require("http").createServer(app);

//connect to database
// if connection successful run app on port 3000
const dbURI = process.env.MONGO_URI;
console.log("Attempting Connection to db...");
mongoose
  .connect(dbURI)
  .then((result) => console.log("Successfully connected to database"))
  .catch((err) => console.log(err));

//add user to database
function add_user(username, email, password) {
  const user = new User({
    username: username,
    email: email,
    password: password,
  });

  user.save().then((result) => {
    console.log(result);
  });
}

//function to checkin to gym
async function checkin_gym(username) {
  //check if user is already inside gym
  const user_again = await User.findOne({ username: username });
  if (user_again.inside_gym) {
    console.log("User already inside gym");
    return;
  }

  //update main user table
  const user = await User.findOne({ username: username });
  user.inside_gym = true;
  user.save().then((result) => {
    console.log(result);

    //update checkins table (log of who goes in and out of gym)
    const checkin = new gym_user({
      username: username,
      inside_gym: true,
    });
    checkin.save().then((result) => {
      console.log(result);
    });
  });
}

//function to checkout of gym
async function checkout_gym(username) {
  //check if user is already outside gym
  const user_again = await User.findOne({ username: username });
  if (!user_again.inside_gym) {
    console.log("User already outside gym");
    return;
  }

  //update main user table
  const user = await User.findOne({ username: username });
  user.inside_gym = false;
  user.save().then((result) => {
    console.log(result);

    //update checkins table (log of who goes in and out of gym)
    const checkin = new gym_user({
      username: username,
      inside_gym: false,
    });
    checkin.save().then((result) => {
      console.log(result);
    });
  });
}

//function to get user details by email
async function get_user_by_email(email) {
  try {
    const user = await User.findOne({ email: email });
    console.log("User found: ", user);
    return user;
  } catch (e) {
    console.log(e);
  }
}

//function to get user details by id
async function get_user_by_id(id) {
  const user = await User.findById(id);
  //console.log("User found: ", user);
  return user;
}

//function to get all users
async function get_users() {
  const users = await User.find();
  console.log(users);
}

//start main website on port 3000
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// register view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// 3rd party module for logging
app.use(morgan("dev"));

// allow to parse form data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse application/json
app.use(express.json());

//added public static files
app.use(express.static("public"));

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register", { message: "" });
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  console.log(req.body);

  //check if user already exists either by email
  const existingEmailUser = await get_user_by_email(req.body.email);

  //check if user already exists either by username
  const existingUsernameUser = await User.findOne({
    username: req.body.username,
  });

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
    const hashedPassword = await bcrpyt.hash(req.body.password, 10);
    add_user(req.body.username, req.body.email, hashedPassword);
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

// if user attempts to go to root page, render index page
app.get("/", checkAuthenticated, (req, res) => {
  console.log("LOOK HERE");
  console.log(req.user.username);
  res.render("index", { name: req.user.username });
});

app.delete("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    // Redirect after successful logout
    res.redirect("/login");
  });
});

// if user attempts to go to root page, render login page
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

// 404 page, only runs if none of the other functions run
app.use((req, res) => {
  res.status(404).render("login");
});
