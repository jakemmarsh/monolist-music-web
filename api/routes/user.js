'use strict';

var when   = require('when');
var _      = require('underscore');
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
        deferred.reject({
          status: 404,
          error: 'User could not be found at identifier: ' + identifier
        });
      } else {
        deferred.resolve(user);
      }
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  getUser(req.params.identifier).then(function(user) {
    res.status(200).json(user);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
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
      deferred.reject({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  retrievePlaylists(req.params.id).then(function(playlists) {
    res.status(200).json(playlists);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.getCollaborations = function(req, res) {

  var retrieveCollaborations = function(id) {
    var deferred = when.defer();

    models.Collaboration.findAll({
      where: { UserId: id }
    }).then(function(collaborations) {
      models.Playlist.findAll({
        where: { id: _.pluck(collaborations, 'PlaylistId') }
      }).then(function(collaborationPlaylists) {
        models.Playlist.findAll({
          where: { UserId: id },
          include: [models.Like, models.Play, models.Tag]
        }).then(function(userPlaylists) {
          deferred.resolve(collaborationPlaylists.concat(userPlaylists));
        }).catch(function(err) {
          deferred.reject({
            status: 500,
            error: err
          });
        });
      }).catch(function(err) {
        deferred.reject({
          status: 500,
          error: err
        });
      });
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  retrieveCollaborations(req.params.id).then(function(playlists) {
    res.status(200).json(playlists);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.getLikes = function(req, res) {

  var retrieveLikes = function(id) {
    var deferred = when.defer();

    models.Like.findAll({
      where: { UserId: id }
    }).then(function(likes) {
      models.Playlist.findAll({
        where: { id: _.pluck(likes, 'PlaylistId') },
        include: [models.Like, models.Play, models.Tag]
      }).then(function(likedPlaylists) {
        deferred.resolve(likedPlaylists);
      }).catch(function(err) {
        deferred.reject({
          status: 500,
          error: err
        });
      });
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  retrieveLikes(req.params.id).then(function(playlists) {
    res.status(200).json(playlists);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.delete = function(req, res) {

  var deleteUser = function(id) {
    var deferred = when.defer();

    req.models.user.get(id).remove(function(err) {
      if ( err ) {
        deferred.reject({
          status: 500,
          error: err
        });
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  };

  deleteUser(req.params.id).then(function() {
    res.status(200).json('User successfully deleted.');
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};