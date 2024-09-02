// app.js
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
require("dotenv").config();

// Importing the initializePassport function
const { initializePassport } = require("./config/passport-config");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const gymRoutes = require("./routes/gymRoutes");
const { checkAdmin } = require("./controllers/authController");

const app = express();
const server = require("http").createServer(app);

// Database connection
connectDB();

// Initialize Passport before using the routes
initializePassport(passport);

// Middleware setup
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
app.use(passport.initialize()); // This initializes Passport
app.use(passport.session()); // This allows persistent login sessions
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use(authRoutes);
app.use(gymRoutes);

// 404 Page
app.use((req, res) => {
  res.status(404).render("login");
});

// Start the server
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
