// Requires
require("dotenv").config();
var fs = require('fs');
var keys = require("./keys.js");
var request = require('request');
var moment = require('moment');
// var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');
var command = process.argv[2];
var input = process.argv[3];
for (var i = 4; i < process.argv.length; i++) {
  input += (" " + process.argv[i]);
};

switch (command) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
};

// CONCERT-THIS

function concertThis() {
  var artist = input.trim();
  var queryUrl = "https://rest.bandsintown.com/artists/" + artist.replace(/ /g, "+") + "/events?app_id=" + keys.bandsintown;
  request(queryUrl, function (error, response, body) {
    if (error) return console.console.log(error);
    if (!error && response.statusCode === 200) {
      if (body.length < 20) {
        return console.log("Invalid Search");
      };
      var data = JSON.parse(body);
      for (var i = 0; i < 3; i++) {
        console.log(("Venue:    ") + data[i].venue.name);
        console.log(("Location: ") + data[i].venue.city + ", " + data[i].venue.country);
        console.log(("Date:     ") + moment(data[i].datetime, 'YYYY-MM-DD').format('MM/DD/YYYY'));
      };
    };
  });
};

// SPOTIFY-THIS-SONG

function spotifyThisSong() {
  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret,
  });
  if (!input) {
    var song = "The Sign Ace of base";
  } else {
    var song = input.trim();
  }
  spotify.search({ type: 'track', query: song }, function (error, data) {
    var name = data.tracks.items[0].name;
    var artist = data.tracks.items[0].artists[0].name;
    var album = data.tracks.items[0].album.name;
    var preview = data.tracks.items[0].preview_url;
    console.log(("Title:  ") + name);
    console.log(("Artist: ") + artist);
    console.log(("Album:  ") + album);
    if (preview) {
      console.log("Preview ") + preview;
    } else {
      console.log("Sorry, No preview on record");
    };
    
  });
};

// MOVIE-THIS

function movieThis() {
  if (!input) {
    var movie = "Mr+Nobody";
  } else {
    var movie = input.trim().replace(/ /g, "+");
  };

  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.omdb;
  request(queryUrl, function (error, response, body) {
    if (error) return console.console.log(error);
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);
      if (data.Response == "False") return console.log("Invalid Search");
      var actors = data.Actors;
      var actorsArray = actors.split(',');
      console.log(("Title           ") + data.Title);
      console.log(("Year            ") + data.Year);
      console.log(("IMDB            ") + data.imdbRating);
      console.log(("Rotten Tomatoes ") + data.Ratings[1].Value);
      console.log(("Produced        ") + data.Country);
      console.log(("Language        ") + data.Language);
      console.log(("Plot: ") + data.Plot);
      console.log("Actors");
      for (var j = 0; j < actorsArray.length; j++) {
        console.log(actorsArray[j].trim());
      };
    };
  });
};

// DO-WHAT-IT-SAYS

function doWhatItSays() {
  fs.readFile('random.txt', 'utf8', function (error, data) {
    if (error) return console.log(error);
    var array = data.split(',');
    switch (array[0]) {
      case "concert-this":
        input = array[1].trim();
        concertThis();
        break;
      case "spotify-this-song":
        input = array[1].trim();
        spotifyThisSong();
        break;
      case "movie-this":
        input = array[1].trim();
        movieThis();
        break;
      default:
        break;
    };
  });
};

// START PROMPT

// inquirer.prompt([
//   {
//     type: 'list',
//     name: 'command_picked',
//     message: "Which command would you like to run?",
//     paginated: true,
//     choices: [new inquirer.Separator(), "concert-this", new inquirer.Separator(), "spotify-this-song", new inquirer.Separator(), "movie-this", new inquirer.Separator(), "do-what-it-says"]
//   }
// ])

//   .then(function (print) {
//     var command_picked = print.command_picked;

//     if (command_picked === "concert-this") {
//        console.log("success")
//       //store command "node liri concert-this"
//       //ask question "What artist would you like to search?"
//       //store search

//     } else if (command_picked === "spotify-this-song") {
//       //store command "node liri spotify-this-song"
//       //ask question "What song would you like to search?"


//     } else if (command_picked === "movie-this") {
//       //store command "node liri movie-this"
//       //ask question "What movie would you like to search?"


//     } else if (command_picked === "do-what-it-says") {


//     }
//   });