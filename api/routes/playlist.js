'use strict';

var when   = require('when');
var _      = require('underscore');
var models = require('../models');

/* ====================================================== */

exports.get = function(req, res) {

  var getPlaylist = function(identifier) {
    var deferred = when.defer();
    var query = { id: identifier };

    if ( isNaN(parseInt(identifier)) ) {
      query = { slug: identifier };
    }

    models.Playlist.find({
      where: query,
      include: [
        {
          model: models.Track,
          include: [
            {
              model: models.User,
              attributes: ['id', 'username']
            },
            {
              model: models.TrackComment,
              include: [{
                model: models.User,
                attributes: ['id', 'username']
              }]
            },
            {
              model: models.Upvote
            },
            {
              model: models.Downvote
            }
          ]
        },
        {
          model: models.Like
        },
        {
          model: models.Play
        },
        {
          model: models.Tag
        },
        {
          model: models.Collaboration
        }
      ]
    }).then(function(playlist) {
      if ( _.isEmpty(playlist) ) {
        deferred.reject({
          status: 404,
          error: 'Playlist could not be found at identifier: ' + identifier
        });
      } else {
        deferred.resolve(playlist);
      }
    }).catch(function(err) {
      console.log('err:', err);
      deferred.reject({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  getPlaylist(req.params.identifier).then(function(playlist) {
    res.status(200).json(playlist);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.search = function(req, res) {

  var searchPlaylists = function(query) {
    var deferred = when.defer();

    models.Playlist.findAll({
      where: { title: {like: '%' + query + '%'} }
    }).success(function(retrievedPlaylists) {
      models.Tag.findAll({
        where: { title: {like: '%' + query + '%'} }
      }).then(function(tags) {
        models.Playlist.findAll({
          where: { id: _.pluck(tags, 'PlaylistId') }
        }).then(function(tagPlaylists) {
          deferred.resolve(retrievedPlaylists.concat(tagPlaylists));
        }).catch(function(err) {
          deferred.reject({
            status: 500,
            body: err
          });
        });
      }).catch(function(err) {
        deferred.reject({
          status: 500,
          body: err
        });
      });
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        body: err
      });
    });

    return deferred.promise;
  };

  searchPlaylists(req.params.query).then(function(playlists) {
    res.status(200).json(playlists);
  }).catch(function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};

/* ====================================================== */

exports.create = function(req, res) {

  console.log('inside create');

  var createPlaylist = function(playlist) {
    var deferred = when.defer();

    models.Playlist.create(playlist).then(function(savedPlaylist) {
      deferred.resolve(savedPlaylist);
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  createPlaylist(req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.like = function(req, res) {

  var likePlaylist = function(playlistId, userId) {
    var deferred = when.defer();
    var like = {
      PlaylistId: playlistId,
      UserId: userId
    };

    models.Like.find({
      where: { UserId: userId, PlaylistId: playlistId }
    }).then(function(retrievedLike) {
      if ( _.isEmpty(retrievedLike) ) {
        models.Like.create(like).then(function(savedLike) {
          deferred.resolve(savedLike);
        }).catch(function(err) {
          deferred.reject({
            status: 500,
            error: err
          });
        });
      } else {
        retrievedLike.destroy().then(function() {
          deferred.resolve('Like successfully removed.');
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

  likePlaylist(req.params.id, req.params.userId).then(function(like) {
    res.status(200).json(like);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.addTrack = function(req, res) {

  var createTrack = function(id, track) {
    var deferred = when.defer();

    models.Track.create(track).then(function() {
      models.Playlist.find({
        where: { id: id },
        include: [models.Like, models.Play, models.Tag]
      }).then(function(playlist) {
        if ( _.isEmpty(playlist) ) {
          deferred.reject({
            status: 404,
            error: 'Playlist could not be found at id: ' + id
          });
        } else {
          deferred.resolve(playlist);
        }
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

  createTrack(req.params.id, req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.removeTrack = function(req, res) {

  var deleteTrack = function(playlistId, trackId) {
    var deferred = when.defer();

    models.Track.destroy({ id: trackId }).then(function() {
      deferred.resolve();
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  deleteTrack(req.params.playlistId, req.params.trackId).then(function() {
    res.status(200).json('Track successfully deleted.');
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.delete = function(req, res) {

  var deletePlaylist = function(id) {
    var deferred = when.defer();

    models.Playlist.destroy({ id: id }).then(function() {
      models.Track.destroy({ PlaylistId: id }).then(function() {
        deferred.resolve();
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

  deletePlaylist(req.params.id).then(function() {
    res.status(200).json('Playlist successfully deleted.');
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};