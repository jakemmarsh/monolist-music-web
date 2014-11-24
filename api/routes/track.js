'use strict';

var when   = require('when');
var _      = require('underscore');
var models = require('../models');

/* ====================================================== */

exports.get = function(req, res) {

  var getTrack = function(id) {
    var deferred = when.defer();

    models.Track.find({
      where: { id: id },
      include: [models.Upvote, models.Downvote, models.TrackComment]
    }).then(function(track) {
      if( _.isEmpty(track) ) {
        deferred.reject({
          status: 404,
          error: 'Track could not be found at id: ' + id
        });
      } else {
        deferred.resolve(track);
      }
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  getTrack(req.params.id).then(function(track) {
    res.status(200).json(track);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });
};

/* ====================================================== */

exports.upvote = function(req, res) {

  var createOrDeleteUpvote = function(trackId, upvote) {
    var deferred = when.defer();

    models.Downvote.destroy({ UserId: upvote.UserId, TrackId: trackId});

    models.Upvote.find({
      where: { UserId: upvote.UserId, TrackId: trackId }
    }).then(function(retrievedUpvote) {
      if ( _.isEmpty(retrievedUpvote) ) {
        models.Upvote.create(upvote).then(function(savedUpvote) {
          deferred.resolve(savedUpvote);
        }).catch(function(err) {
          deferred.reject({
            status: 500,
            error: err
          });
        });
      } else {
        retrievedUpvote.destroy().then(function() {
          deferred.resolve('Upvote successfully removed.');
        }).catch(function(err) {
          deferred.reject({
            status: 500,
            error: err
          });
        });
      }
    });

    return deferred.promise;
  };

  createOrDeleteUpvote(req.params.id, req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.downvote = function(req, res) {

  var createOrDeleteDownvote = function(trackId, downvote) {
    var deferred = when.defer();

    models.Upvote.destroy({ UserId: downvote.UserId, TrackId: trackId});

    models.Downvote.find({
      where: { UserId: downvote.UserId, TrackId: trackId }
    }).then(function(retrievedDownvote) {
      if ( _.isEmpty(retrievedDownvote) ) {
        models.Downvote.create(downvote).then(function(savedDownvote) {
          deferred.resolve(savedDownvote);
        }).catch(function(err) {
          deferred.reject({
            status: 500,
            error: err
          });
        });
      } else {
        retrievedDownvote.destroy().then(function() {
          deferred.resolve('Downvote successfully removed.');
        }).catch(function(err) {
          deferred.reject({
            status: 500,
            error: err
          });
        });
      }
    });

    return deferred.promise;
  };

  createOrDeleteDownvote(req.params.id, req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.addComment = function(req, res) {

  var createComment = function(id, comment) {
    var deferred = when.defer();

    models.TrackComment.create(comment).then(function(savedComment) {
      deferred.resolve(savedComment);
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  createComment(req.params.id, req.body).then(function(comment) {
    res.status(200).json(comment);
  }, function(status, err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.removeComment = function(req, res) {

  var deleteComment = function(trackId, commentId, user) {
    var deferred = when.defer();

    models.TrackComment.find({
      where: { id: commentId, TrackId: trackId }
    }).then(function(retrievedComment) {
      if ( user.role === 'admin' || retrievedComment.UserId === user.id ) {
        retrievedComment.destroy().then(function() {
          deferred.resolve('Comment successfully removed.');
        }).catch(function(err) {
          deferred.resolve({
            status: 500,
            error: err
          });
        });
      } else {
        deferred.resolve({
          status: 401,
          error: 'Current user does not have permission to delete comment: ' + user.id
        });
      }
    }).catch(function(err) {
      deferred.resolve({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  deleteComment(req.params.id, req.params.commentId, req.user).then(function(resp) {
    res.status(200).json(resp);
  }).catch(function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};