var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

var exphbs = require("express-handlebars");

// Require all models
// var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.set('debug', true);
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscrape";
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Import routes and give the server access to them.
var routes = require("./controllers/newsController.js");
app.use("/", routes);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
