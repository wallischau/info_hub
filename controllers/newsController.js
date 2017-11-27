var express = require("express");
var mongoose = require("mongoose");

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

var router = express.Router();
// Require all models
var db = require("../models");
// mongoose.Promise = Promise;

// Import the model (News.js) to use its database functions.
// var News = require("../models/News.js");
// Create all our routes and set up logic within those routes where required.
router.get("/scrape", function(req, res) {
	db.News.remove({});
	newsArray = [];
  // First, we grab the body of the html with request
  request("https://www.smashingmagazine.com/articles/", (error, response, html) => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);

    // Now, we grab every h1,div,p within an article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("h1")
        .children("a")
        .text();
      result.content = $(this)
        .children("div")
        .children("p")
        .text();
      result.link = $(this)
        .children("div")
        .children("p")
        .children(".read-more-link")
        .attr("href");
      console.log('result: ', result);

      //check if it is already in db
      db.News
      .findOne({title: result.title})
      .then(function(dbNews) {  //check for new entry
      	if(dbNews) {
      		console.log("dup entry: " + i);
      		return true;
      	}

      // Create a new News using the `result` object built from scraping
      db.News
        .create(result)
        .then(function(dbNews) {
          // If we were able to successfully scrape and save a News, send a message to the client
          console.log("scrape complete: " + i);
          // console.log(dbNews);
          // res.send("Scrape Complete");
          // newsArray.push(dbNews);
          // console.log(i + ":" + newsArray);
        })//.then
        .catch(function(err) {
        	console.log("here: " + i);
          // If an error occurred, send it to the client
          res.json(err);
        });//catch
      }); //then new entry
    });// each
    // console.log(newsArray);
    // res.send(newsArray);
    console.log('redirect');
    res.redirect("/news");
  });//request
});//get /

// Route for getting all Articles from the db
router.get("/news", function(req, res) {
  // Grab every document in the News collection
  db.News
    .find({})
    .then(function(dbNews) {
      // If we were able to successfully find News, send them back to the client
      res.json(dbNews);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific News by id, populate it with it's note
router.get("/news/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.News
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbNews) {
      // If we were able to successfully find a News with the given id, send it back to the client
      res.json(dbNews);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
router.post("/news/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment
    .create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one News with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Comment
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.News.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
    })
    .then(function(dbNews) {
      // If we were able to successfully update an News, send it back to the client
      res.json(dbNews);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Export routes for server.js to use.
module.exports = router;
