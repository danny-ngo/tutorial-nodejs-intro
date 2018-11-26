// server.js

// set up -------------------------
// get all libraries

var express 	= require("express");
var app 		= express();
var port 		= process.env.PORT || 3000;
var passport 	= require("passport");

var cookieParser= require("cookie-parser");
var bodyParser 	= require("body-parser");
var session		= require("express-session");
// configuration -------------------

app.use(bodyParser());
app.use(cookieParser());

// setup view engine
app.set('view engine', 'ejs');
app.set('views', __dirname+'/res/views');

// setup routes
require("./app/routes.js")(app,passport);

console.log("listening on port "+port);

app.listen(port);