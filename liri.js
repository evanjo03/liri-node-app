require("dotenv").config();
var fs = require("fs")
var axios = require("axios");
var bandsintown = require("bandsintown")("codingbootcamp");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

//variables to store inputs
var action = process.argv[2];
var searchEntry = process.argv[3];

//here we define the switch
function runFunctionSwitch(actionChoice, thing) {
    switch (actionChoice) {
        case "concert-this":
            concertThis(thing);
            break;
        case "spotify-this-song":
            spotifyThis(thing);
            break;
        case "movie-this":
            movieThis(thing);
            break;
        case "do-what-it-says":
            doWhatItSays(thing);
            break;
        default: 
            console.log("Incorrect Entry.")
    }
}

//function reads inputs to determine which application method to run
runFunctionSwitch(action,searchEntry);

function concertThis(artist) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&date=upcoming"

    axios.get(queryUrl).then(function (response) {
        var schedArray = response.data[0].datetime.split("T");
        var date = schedArray[0];
        var time = schedArray[1];

        //print to console
        console.log("Concert Date: " + date + "\nConcert Time: " + time + "\nVenue Name: " + response.data[0].venue.name + "\nVenue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region);
        //need name of venue, venue location
    });
};

function spotifyThis(name) {
    //need artist(s), song name, preview link of song on spotify, album
    //if no song is provided, program defaults to "The Sign" by Ace of Base
    if (!name) {
        console.log("No name was provided");
        spotify.search({ type: 'track', query: "The Sign" }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var songInfo = data.tracks.items[0];

            //print to console
            console.log("Artist name: " + songInfo.artists[0].name + "\nSong name: " + songInfo.name + "\nAlbum name: " + songInfo.album.name + "\nPreview link: " + songInfo.preview_url);
        });
    }
    else {
        spotify.search({ type: 'track', query: name }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var songInfo = data.tracks.items[0];

            //print to console
            console.log("Artist name: " + songInfo.artists[0].name + "\nSong name: " + songInfo.name + "\nAlbum name: " + songInfo.album.name + "\nPreview link: " + songInfo.preview_url);
        });
    };
};

function movieThis(movie) {
    if (!movie) {
        var queryUrl = "http://www.omdbapi.com/?t=" + "Mr. Nobody" + "&y=&plot=short&apikey=trilogy";

        axios.get(queryUrl).then(function (result) {
            var response = result.data;

            //print to console
            console.log("Title: " + response.Title "\nRated: " + response.Rated + "\nIMDB Rating: " + response.Ratings[0].Value)
            if (response.Ratings[1]) {
            console.log("Rotten Tomatoes Rating: " + response.Ratings[1].Value)
            }
            console.log("Country(s) of Production: " + response.Country + "\nLanguage: " + response.Language + "\nPlot: " +  response.Plot)
        });
    }
    else {
        var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

        axios.get(queryUrl).then(function (result) {
            var response = result.data;

             //print to console
             console.log("Title: " + response.Title "\nRated: " + response.Rated + "\nIMDB Rating: " + response.Ratings[0].Value)
             if (response.Ratings[1]) {
             console.log("Rotten Tomatoes Rating: " + response.Ratings[1].Value)
             }
             console.log("Country(s) of Production: " + response.Country + "\nLanguage: " + response.Language + "\nPlot: " +  response.Plot)
        });
    };
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) throw error;
        var splitIndex = data.indexOf(" ")
        action = data.slice(0, splitIndex);
        searchEntry = data.slice(splitIndex + 1);
        
        runFunctionSwitch(action,searchEntry)
        //should spotify "I want it that way"
    });
};

