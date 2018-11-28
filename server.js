// server.js

// set up -------------------------
// get all libraries
require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const app = express();
const port = 3000;
const passport = require("passport");
const flash = require("connect-flash");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const { sequelize } = require("./db");
// configuration -------------------

require("./config/passport")(passport); // pass passport for configuration

// set up our express application
app.use(logger("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(session({ secret: "qweb-rocks" })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// setup routes
require("./app/routes.js")(app, passport);

console.log("listening on port " + port);

app.listen(port);
