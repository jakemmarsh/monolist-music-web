'use strict';

var when   = require('when');
var _      = require('lodash');
var models = require('../models');

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
          model: models.Playlist,
          include: [models.Like, models.Play, models.Tag]
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

exports.getPlaylists = function(req, res) {

  var retrievePlaylists = function(id) {
    var deferred = when.defer();

    models.Playlist.findAll({
      where: { UserId: id },
      include: [models.Like, models.Play, models.Tag]
    }).then(function(playlists) {
      deferred.resolve(playlists);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  retrievePlaylists(req.params.id).then(function(playlists) {
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
      deferred.resolve({ userId: userId, collaborations: collaborations });
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  var fetchCollaborationPlaylists = function(data) {
    var deferred = when.defer();
    var userId = data.userId;
    var collaborations = data.collaborations;

    models.Playlist.findAll({
      where: { id: _.pluck(collaborations, 'PlaylistId') }
    }).then(function(collaborationPlaylists) {
      deferred.resolve({ userId: userId, collaborationPlaylists: collaborationPlaylists });
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  var fetchUserPlaylists = function(data) {
    var deferred = when.defer();
    var userId = data.userId;
    var collaborationPlaylists = data.collaborationPlaylists;

    models.Playlist.findAll({
      where: { UserId: userId },
      include: [models.Like, models.Play, models.Tag]
    }).then(function(userPlaylists) {
      deferred.resolve(collaborationPlaylists.concat(userPlaylists));
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  fetchCollaborations(req.params.id)
  .then(fetchCollaborationPlaylists)
  .then(fetchUserPlaylists)
  .then(function(playlists) {
    res.status(200).json(playlists);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.getLikes = function(req, res) {

  var fetchLikes = function(id) {
    var deferred = when.defer();

    models.Like.findAll({
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
      where: { id: _.pluck(likes, 'PlaylistId') },
      include: [models.Like, models.Play, models.Tag]
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

exports.delete = function(req, res) {

  var deleteUser = function(id) {
    var deferred = when.defer();

    models.User.destroy({ id: id }).then(function() {
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