/*  News Scraper                                 */
/*  Author: Wallis Chau                          */
/*  Description: Scrap news from a websitee      */
/*               and store in db along with comment */
/*  Date: 11/25/17                                */
var mongoose = require("mongoose");
// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var NewsSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: false 
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the news with an associated Note
   note: {
     type: Schema.Types.ObjectId,
     ref: "Comment"
   }
});

// This creates our model from the above schema, using mongoose's model method
var News = mongoose.model("News", NewsSchema);

// Export the News model
module.exports = News;