const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const User = require("./models/user");
const { get } = require("http");
require("dotenv").config();

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

//function to get all users
async function get_users() {
  const users = await User.find();
  console.log(users);
}

//add_user("test2", "test@gmail.com2", "testpassword");
//get_users();

//start main website on port 3000
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// register view engine
app.set("view engine", "ejs");
app.set("views", "views");

// 3rd party module for logging
app.use(morgan("dev"));

// Middleware to parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware to parse application/json
app.use(express.json());

//added public static files
app.use(express.static("public"));

// if user attempts to go to root page, render index page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  console.log(req.body);
  add_user(req.body.username, req.body.email, req.body.password);
  res.send("register");
});
