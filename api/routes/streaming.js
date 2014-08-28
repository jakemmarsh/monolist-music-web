'use strict';
var request = require('request');

exports.youtube = function(req, res) {

  // https://github.com/jameskyburz/youtube-audio-stream

  res.send('Youtube video ID: ' + req.params.videoId);

};

exports.soundcloud = function(req, res) {

  // write my own API wrapper?

  res.send('Soundcloud song ID: ' + req.params.songId);

};

exports.spotify = function(req, res) {

  // https://github.com/Floby/node-libspotify

  res.send('Spotify song ID: ' + req.params.songId);

};

exports.bandcamp = function(req, res) {

  var bandcampUrl = decodeURIComponent(req.params.songUrl);


  /*
   * parse the page loaded by songUrl
   * direct link to the mp3 is in a script tag,
   * within an object called `TralbumData`,
   * a nested object called `trackinfo`,
   * at the key `mp3-128`
   */
  request({
    uri: bandcampUrl
  }, function(error, response) {
    var trackRegex = /{"mp3-128":"(.+?)"/ig;
    var urlResults = trackRegex.exec(response.body);

    if ( urlResults !== null ) {
      request.get(urlResults[1]).pipe(res);
    } else {
      res.status(500).send(response);
    }
  });

};