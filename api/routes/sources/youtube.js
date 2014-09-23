'use strict';

var path          = require('path');
var Q             = require('q');
var qs            = require('querystring');
var request       = require('request');
var _             = require('underscore');
var youtubeStream = require('youtube-audio-stream');
var config        = require(path.join(__dirname, '../../../config'));

/* ====================================================== */

exports.search = function(query, limit) {

  var mainDeferred = Q.defer();

  var getSearchResults = function(searchQuery) {
    var deferred = Q.defer();
    var searchUrl = 'https://www.googleapis.com/youtube/v3/search?';
    var searchParameters = {
      type: 'video',
      part: 'snippet',
      q: searchQuery.replace(/(%20)|( )/gi, '+'),
      maxResults: limit,
      key: config.youtube.key
    };
    var searchResults;

    searchUrl += qs.stringify(searchParameters);

    request(searchUrl, function(err, response, body) {
      if ( err ) {
        deferred.reject(err);
      }

      // convert from string to JSON
      body = JSON.parse(body);

      // process each search result
      searchResults = _.map(body.items, function(item) {
        return {
          source: 'youtube',
          title: item.snippet.title,
          image: item.snippet.thumbnails.high.url,
          id: item.id.videoId
        };
      });

      deferred.resolve(searchResults);
    });

    return deferred.promise;
  };

  getSearchResults(query).then(function(results) {
    mainDeferred.resolve(results);
  }, function(err) {
    mainDeferred.reject(err);
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