'use strict';

var path          = require('path');
var Q             = require('q');
var qs            = require('querystring');
var request       = require('request');
var _             = require('lodash');
var youtubeStream = require('youtube-audio-stream');
var config        = require(path.join(__dirname, '../../../config'));

/* ====================================================== */

/*
 * Convert YouTube's duration format to seconds
 */
function parseYouTubeDuration(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') === -1 && duration.indexOf('S') === -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1 && duration.indexOf('S') === -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length === 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length === 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length === 1) {
        duration = duration + parseInt(a[0]);
    }
    return duration;
}

/* ====================================================== */

exports.search = function(query, limit) {

  var mainDeferred = Q.defer();

  var getVideoDuration = function(infoUrl) {
    var deferred = Q.defer();
    var duration;

    request(infoUrl, function(err, response, body) {
      if ( err ) {
        deferred.reject(err);
      } else {
        body = JSON.parse(body);

        duration = body.items ? parseYouTubeDuration(body.items[0].contentDetails.duration) : null;
        deferred.resolve(duration);
      }
    });

    return deferred.promise;
  };

  var addVideoDurations = function(videos) {
    var deferred = Q.defer();
    var infoUrl = 'https://www.googleapis.com/youtube/v3/videos?';
    var infoParameters = {
      part: 'contentDetails',
      key: config.youtube.key
    };
    var promises = [];

    _.each(videos, function(videoObject) {
      infoParameters.id = videoObject.sourceParam;

      promises.push(getVideoDuration(infoUrl + qs.stringify(infoParameters)));
    });

    Q.all(promises).then(function(durations) {
      _.each(durations, function(duration, index) {
        videos[index].duration = duration;
      });
      deferred.resolve(videos);
    }, function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

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
      } else {
        body = JSON.parse(body);

        // process each search result
        searchResults = _.map(body.items, function(item) {
          return {
            source: 'youtube',
            title: item.snippet.title,
            imageUrl: item.snippet.thumbnails.high.url,
            sourceParam: item.id.videoId,
            sourceUrl: 'http://youtube.com/watch?v=' + item.id.videoId
          };
        });

        deferred.resolve(addVideoDurations(searchResults));
      }
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
    youtubeStream(requestUrl, { audioFormat: 'wav' }).pipe(res);
    res.setHeader('Content-Type', 'audio/x-wav');
    res.setHeader('Accept-Ranges', 'bytes');
  } catch(exception) {
    console.log('exception streaming YouTube track:', exception);
    res.status(500).send(exception);
  }

};