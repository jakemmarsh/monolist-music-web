'use strict';

var path          = require('path');
var Q             = require('q');
var request       = require('request');
var youtubeStream = require('youtube-audio-stream');
var config        = require(path.join(__dirname, '../../../config'));

/* ====================================================== */

exports.search = function(query, limit) {

  var mainDeferred = Q.defer();

  var getSearchResults = function(searchQuery) {
    var deferred = Q.defer();
    var searchUrl = 'https://www.googleapis.com/youtube/v3/search';
    var searchResults = [];
    var trackResult;

    searchQuery = encodeURIComponent(searchQuery).replace('%20', '+');

    searchUrl += '?type=video';
    searchUrl += '&maxResults=' + limit;
    searchUrl += '&part=snippet';
    searchUrl += '&q=' + searchQuery;
    searchUrl += '&key=' + config.youtube.key;

    request(searchUrl, function(error, response, body) {
      if ( error ) {
        deferred.reject(error);
      }

      // convert from string to JSON
      body = JSON.parse(body);

      // process each search result
      body.items.forEach(function(item) {
        trackResult = {
          source: 'youtube',
          title: item.snippet.title,
          image: item.snippet.thumbnails.high.url,
          id: item.id.videoId
        };

        searchResults.push(trackResult);
      });

      deferred.resolve(searchResults);
    });

    return deferred.promise;
  };

  getSearchResults(query).then(function(results) {
    mainDeferred.resolve(results);
  }, function(error) {
    mainDeferred.reject(error);
  });

  return mainDeferred.promise;

};

/* ====================================================== */

exports.stream = function(req, res) {

  var requestUrl = 'http://youtube.com/watch?v=' + req.params.videoId;

  try {
    youtubeStream(requestUrl).pipe(res);
  } catch(exception) {
    res.status(500).send(exception);
  }

};