'use strict';

var when      = require('when');
var Sequelize = require('sequelize');
var _         = require('lodash');
var models    = require('../models');

/* ====================================================== */

exports.get = function(req, res) {

  var getUser = function(identifier) {
    var deferred = when.defer();
    var query = { id: identifier };

    if ( isNaN(parseInt(identifier)) ) {
      query = { username: identifier };
    }

    models.User.find({
      where: query,
      include: [
        {
          model: models.UserSubscription,
          as: 'Subscribers'
        },
        {
          model: models.UserSubscription,
          as: 'Subscriptions'
        }
      ]
    }).then(function(user) {
      if ( _.isEmpty(user) ) {
        deferred.reject({ status: 404, body: 'User could not be found at identifier: ' + identifier });
      } else {
        deferred.resolve(user);
      }
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  getUser(req.params.identifier).then(function(user) {
    res.status(200).json(user);
  }, function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.update = function(req, res) {

  var fetchUser = function(id, updates) {
    var deferred = when.defer();

    models.User.find({
      where: { id: id }
    }).then(function(user) {
      if ( !_.isEmpty(user) ) {
        deferred.resolve([user, updates]);
      } else {
        deferred.reject({ status: 404, body: 'User could not be found at the ID: ' + id });
      }
    });

    return deferred.promise;
  };

  var updateUser = function(data) {
    var deferred = when.defer();
    var retrievedUser = data[0];
    var updates = data[1];
    var sanitizedUpdates = {};

    if ( updates.email || updates.Email ) {
      sanitizedUpdates.email = updates.email || updates.Email;
    }

    if ( updates.password || updates.Password ) {
      sanitizedUpdates.hash = updates.password || updates.Password;
    }

    retrievedUser.updateAttributes(sanitizedUpdates).then(function(updatedUser) {
      deferred.resolve(updatedUser);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  fetchUser(req.params.id, req.body)
  .then(updateUser)
  .then(function(updatedUser) {
    res.status(200).json(updatedUser);
  }).catch(function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.getPlaylists = function(req, res) {

  var fetchPlaylists = function(id) {
    var deferred = when.defer();

    models.Playlist.findAll({
      where: {
        UserId: id,
        privacy: 'public' // TODO: logic so that participants/creators can still see activity if playlist is private
      },
      include: [
        {
          model: models.PlaylistLike,
          as: 'Likes'
        },
        {
          model: models.PlaylistPlay,
          as: 'Plays'
        }
      ]
    }).then(function(playlists) {
      deferred.resolve(playlists);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  fetchPlaylists(req.params.id).then(function(playlists) {
    res.status(200).json(playlists);
  }, function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.getEditablePlaylists = function(req, res) {

  var fetchCollaborations = function(userId) {
    var deferred = when.defer();

    models.Collaboration.findAll({
      where: { UserId: userId }
    }).then(function(collaborations) {
      deferred.resolve({ userId: userId, collaborations: collaborations });
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  var fetchEditablePlaylists = function(data) {
    var deferred = when.defer();
    var userId = data.userId;
    var collaborations = data.collaborations;

    models.Playlist.findAll({
      where: Sequelize.or(
        { id: _.pluck(collaborations, 'PlaylistId') },
        { UserId: userId }
      ),
      include: [
        {
          model: models.PlaylistLike,
          as: 'Likes'
        },
        {
          model: models.PlaylistPlay,
          as: 'Plays'
        }
      ]
    }).then(function(editablePlaylists) {
      deferred.resolve(editablePlaylists);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  fetchCollaborations(req.params.id)
  .then(fetchEditablePlaylists)
  .then(function(playlists) {
    res.status(200).json(playlists);
  }, function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.getCollaborations = function(req, res) {

  var fetchCollaborations = function(userId) {
    var deferred = when.defer();

    models.Collaboration.findAll({
      where: { UserId: userId }
    }).then(function(collaborations) {
      deferred.resolve(collaborations);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  var fetchCollaborationPlaylists = function(collaborations) {
    var deferred = when.defer();

    models.Playlist.findAll({
      where: {
        id: _.pluck(collaborations, 'PlaylistId'),
        privacy: 'public' // TODO: logic so that participants/creators can still see activity if playlist is private
      },
      include: [
        {
          model: models.PlaylistLike,
          as: 'Likes'
        },
        {
          model: models.PlaylistPlay,
          as: 'Plays'
        }
      ]
    }).then(function(collaborationPlaylists) {
      deferred.resolve(collaborationPlaylists);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  fetchCollaborations(req.params.id)
  .then(fetchCollaborationPlaylists)
  .then(function(playlists) {
    res.status(200).json(playlists);
  }, function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.getLikes = function(req, res) {

  var fetchLikes = function(id) {
    var deferred = when.defer();

    models.PlaylistLike.findAll({
      where: { UserId: id }
    }).then(function(likes) {
      deferred.resolve(likes);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  var fetchPlaylists = function(likes) {
    var deferred = when.defer();

    models.Playlist.findAll({
      where: {
        id: _.pluck(likes, 'PlaylistId'),
        privacy: 'public' // TODO: logic so that participants/creators can still see activity if playlist is private
      },
      include: [
        {
          model: models.PlaylistLike,
          as: 'Likes'
        },
        {
          model: models.PlaylistPlay,
          as: 'Plays'
        }
      ]
    }).then(function(likedPlaylists) {
      deferred.resolve(likedPlaylists);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  fetchLikes(req.params.id)
  .then(fetchPlaylists)
  .then(function(likedPlaylists) {
    res.status(200).json(likedPlaylists);
  }, function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.getStars = function(req, res) {

  var fetchStars = function(id) {
    var deferred = when.defer();

    models.TrackStar.findAll({
      where: { UserId: id }
    }).then(function(stars) {
      deferred.resolve(stars);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  var fetchTracks = function(stars) {
    var deferred = when.defer();

    models.Track.findAll({
      where: { id: _.pluck(stars, 'TrackId') }
    }).then(function(starredTracks) {
      deferred.resolve(starredTracks);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  fetchStars(req.params.id)
  .then(fetchTracks)
  .then(function(starredTracks) {
    res.status(200).json(starredTracks);
  }, function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.subscribe = function(req, res) {

  var createOrDeleteSubscription = function(trackId, upvote) {
    var deferred = when.defer();

    // models.Subscription.destroy({
    //   where: {
    //     UserId: upvote.UserId,
    //     TrackId: trackId
    //   }
    // });

    // models.Upvote.find({
    //   where: { UserId: upvote.UserId, TrackId: trackId }
    // }).then(function(retrievedUpvote) {
    //   if ( _.isEmpty(retrievedUpvote) ) {
    //     models.Upvote.create(upvote).then(function(savedUpvote) {
    //       deferred.resolve(savedUpvote);
    //     }).catch(function(err) {
    //       deferred.reject({ status: 500, body: err });
    //     });
    //   } else {
    //     retrievedUpvote.destroy().then(function() {
    //       deferred.resolve('Upvote successfully removed.');
    //     }).catch(function(err) {
    //       deferred.reject({ status: 500, body: err });
    //     });
    //   }
    // });

    return deferred.promise;
  };

  createOrDeleteSubscription(req.params.id, req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.delete = function(req, res) {

  var deleteUser = function(id) {
    var deferred = when.defer();

    models.User.destroy({
      where: { id: id }
    }).then(function() {
      deferred.resolve();
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  deleteUser(req.params.id).then(function() {
    res.status(200).json('User successfully deleted.');
  }, function(err) {
    res.status(err.status).json({ error: err.body });
  });

};