'use strict';

var when = require('when');
var _    = require('underscore');

/* ====================================================== */

exports.upvote = function(req, res) {

  var createOrDeleteUpvote = function(id, upvote) {
    var deferred = when.defer();
    var dbUpvote = new req.models.upvote(upvote);
    var userId = upvote.user_id;
    var userUpvote;

    req.models.track.get(id, function(err, track) {
      console.log('track:', track);
      if ( err ) {
        deferred.reject(err);
      } else {
        userUpvote = _.find(track.upvotes, function(upvote) {
          return upvote.user_id === userId;
        });

        if ( userUpvote ) {
          req.models.upvote.find({ id: userUpvote.id }).remove(function(err) {
            if ( err ) {
              deferred.reject(err);
            } else {
              deferred.resolve();
            }
          });
        } else {
          dbUpvote.save(function(err, savedUpvote) {
            if ( err ) {
              deferred.reject(err);
            } else {
              deferred.resolve(savedUpvote);
            }
          });
        }
      }
    });

    return deferred.promise;
  };

  createOrDeleteUpvote(req.params.id, req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(500).send(err);
  });

};

/* ====================================================== */

exports.downvote = function(req, res) {

  var createOrDeleteDownvote = function(id, downvote) {
    var deferred = when.defer();
    var dbDownvote = new req.models.downvote(downvote);
    var userId = downvote.user_id;
    var userDownvote;

    req.models.track.get(id, function(err, track) {
      if ( err ) {
        deferred.reject(err);
      } else {
        userDownvote = _.find(track.upvotes, function(upvote) {
          return upvote.user_id === userId;
        });

        if ( userDownvote ) {
          req.models.downvote.find({ id: userDownvote.id }).remove(function(err) {
            if ( err ) {
              deferred.reject(err);
            } else {
              deferred.resolve();
            }
          });
        } else {
          dbDownvote.save(function(err, savedDownvote) {
            if ( err ) {
              deferred.reject(err);
            } else {
              deferred.resolve(savedDownvote);
            }
          });
        }
      }
    });

    return deferred.promise;
  };

  createOrDeleteDownvote(req.params.id, req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(500).send(err);
  });

};

/* ====================================================== */

exports.addComment = function(req, res) {

  var createComment = function(id, comment) {
    var deferred = when.defer();
    var dbComment = new req.models.trackComment(comment);

    dbComment.save(function(err, savedComment) {
      if ( err ) {
        deferred.reject(err);
      } else {
        deferred.resolve(savedComment);
      }
    });

    return deferred.promise;
  };

  createComment(req.params.id, req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(500).send(err);
  });

};