const express = require("express");

//express app
const app = express();
const server = require("http").createServer(app);

//start main website on port 80
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// register view engine
app.set("view engine", "ejs");
app.set("views", "views");

//added public static files
app.use(express.static("public"));

// if user attempts to go to root page, render index page
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});
