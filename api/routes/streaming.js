'use strict';

var Q       = require('q');
var request = require('request');

/* ====================================================== */

exports.youtube = function(req, res) {

  // https://github.com/jameskyburz/youtube-audio-stream

  res.send('Youtube video ID: ' + req.params.videoId);

};

/* ====================================================== */

exports.soundcloud = function(req, res) {

  // write my own API wrapper?

  res.send('Soundcloud song ID: ' + req.params.songId);

};

/* ====================================================== */

exports.spotify = function(req, res) {

  // https://github.com/Floby/node-libspotify

  res.send('Spotify song ID: ' + req.params.songId);

};

/* ====================================================== */

exports.bandcamp = function(req, res) {

  var bandcampUrl = decodeURIComponent(req.params.songUrl);

  /*
   * parse the page loaded by bandcampUrl
   * direct link to the mp3 is in a script tag,
   * within an object called `TralbumData`,
   * a nested object called `trackinfo`,
   * at the key `mp3-128`
   */
  var getTrackFile = function(url) {
    var deferred = Q.defer();

    request({
      uri: url
    }, function(error, response) {
      if ( error ) {
        deferred.reject('Unable to retrieve the MP3 file for the specified URL.');
      }

      var trackRegex = /{"mp3-128":"(.+?)"/ig;
      var urlResults = trackRegex.exec(response.body);

      if ( urlResults !== null ) {
        deferred.resolve(request.get(urlResults[1]));
      } else {
        deferred.reject('Unable to retrieve the MP3 file for the specified URL.');
      }
    });

    return deferred.promise;
  };

  getTrackFile(bandcampUrl).then(function(trackUrl) {
    trackUrl.pipe(res);
  }, function(error) {
    res.status(500).send(error);
  });

};