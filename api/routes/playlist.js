'use strict';

var when   = require('when');
var _      = require('lodash');
var models = require('../models');

/* ====================================================== */

function ensureCurrentUserCanEdit(req, playlistId) {

  var mainDeferred = when.defer();

  var checkUserPlaylists = function() {
    var deferred = when.defer();

    models.Playlist.find({
      where: { id: playlistId, UserId: req.user.id }
    }).then(function(playlist) {
      if ( !_.isEmpty(playlist) ) {
        deferred.resolve(true);
      } else {
        // Resolve to still pass to checkCollaborations
        deferred.resolve(false);
      }
    }).catch(function() {
      deferred.reject();
    });

    return deferred.promise;
  };

  var checkCollaborations = function(userPlaylistsResult) {
    var deferred = when.defer();

    if ( userPlaylistsResult ) {
      // Already been confirmed that user can edit the playlist
      deferred.resolve();
    } else {
      models.Collaboration.findAll({
        where: { PlaylistId: playlistId, UserId: req.user.id }
      }).then(function(collaborations) {
        if ( !_.isEmpty(collaborations) ) {
          deferred.resolve();
        } else {
          deferred.reject();
        }
      }).catch(function() {
        deferred.reject();
      });
    }

    return deferred.promise;
  };

  checkUserPlaylists()
  .then(checkCollaborations)
  .then(function() {
    mainDeferred.resolve();
  }).catch(function() {
    mainDeferred.reject({ status: 401, body: 'Current user does not have permission to edit playlist: ' + req.params.id });
  });

  return mainDeferred.promise;

}

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
          model: models.User,
          attributes: ['id', 'username']
        },
        {
          model: models.Track,
          include: [
            {
              model: models.User,
              attributes: ['id', 'username']
            },
            {
              model: models.TrackComment,
              as: 'Comments',
              include: [{
                model: models.User,
                attributes: ['id', 'username', 'imageUrl']
              }]
            },
            {
              model: models.TrackUpvote,
              as: 'Upvotes'
            },
            {
              model: models.TrackDownvote,
              as: 'Downvotes'
            }
          ]
        },
        {
          model: models.PlaylistLike,
          as: 'Likes'
        },
        {
          model: models.PlaylistPlay,
          as: 'Plays'
        }
      ]
    }).then(function(playlist) {
      if ( _.isEmpty(playlist) ) {
        deferred.reject({ status: 404, body: 'Playlist could not be found at identifier: ' + identifier });
      } else {
        deferred.resolve(playlist);
      }
    }).catch(function(err) {
      console.log('error getting playlist:', err);
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  getPlaylist(req.params.identifier).then(function(playlist) {
    res.status(200).json(playlist);
  }, function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.search = function(req, res) {

  var searchPlaylists = function(query) {
    var deferred = when.defer();

    models.Playlist.findAll({
      where: { title: {ilike: '%' + query + '%'}, privacy: 'public' }
    }).then(function(retrievedPlaylists) {
      models.PlaylistTag.findAll({
        where: { title: {ilike: '%' + query + '%'} }
      }).then(function(tags) {
        models.Playlist.findAll({
          where: { id: _.pluck(tags, 'PlaylistId'), privacy: 'public' }
        }).then(function(tagPlaylists) {
          deferred.resolve(retrievedPlaylists.concat(tagPlaylists));
        }).catch(function(err) {
          deferred.reject({ status: 500, body: err });
        });
      }).catch(function(err) {
        deferred.reject({ status: 500, body: err });
      });
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  searchPlaylists(req.params.query).then(function(playlists) {
    res.status(200).json(playlists);
  }).catch(function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.create = function(req, res) {

  var createPlaylist = function(playlist) {
    var deferred = when.defer();

    models.Playlist.create(playlist).then(function(savedPlaylist) {
      deferred.resolve(savedPlaylist);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  createPlaylist(req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(err.status).json({ error: err.body });
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

    models.PlaylistLike.find({
      where: { UserId: userId, PlaylistId: playlistId }
    }).then(function(retrievedLike) {
      if ( _.isEmpty(retrievedLike) ) {
        models.PlaylistLike.create(like).then(function(savedLike) {
          deferred.resolve(savedLike);
        }).catch(function(err) {
          deferred.reject({ status: 500, body: err });
        });
      } else {
        retrievedLike.destroy().then(function() {
          deferred.resolve('Like successfully removed.');
        }).catch(function(err) {
          deferred.reject({ status: 500, body: err });
        });
      }
    });

    return deferred.promise;
  };

  likePlaylist(req.params.id, req.user.id).then(function(like) {
    res.status(200).json(like);
  }, function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.addCollaborator = function(req, res) {

  var addCollaboration = function() {
    var deferred = when.defer();
    var collaboration = {
      PlaylistId: req.params.playlistId,
      UserId: req.params.userId
    };

    models.Collaboration.create(collaboration).then(function(createdCollaboration) {
      deferred.resolve(createdCollaboration);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  ensureCurrentUserCanEdit(req, req.params.playlistId)
  .then(addCollaboration)
  .then(function(collaboration) {
    res.status(200).json(collaboration);
  }).catch(function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.removeCollaborator = function(req, res) {

  var removeCollaboration = function() {
    var deferred = when.defer();

    models.Collaboration.destroy({
      PlaylistId: req.params.playlistId,
      UserId: req.params.userId
    }).then(function() {
      deferred.resolve();
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  ensureCurrentUserCanEdit(req, req.params.playlistId)
  .then(removeCollaboration)
  .then(function() {
    res.status(200).json('Collaborator successfully removed.');
  }).catch(function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.addTrack = function(req, res) {

  var createTrack = function() {
    var deferred = when.defer();
    var track = {
      PlaylistId: req.params.id || req.body.playlistId || req.body.PlaylistId,
      UserId: req.user.id || req.body.userId || req.body.UserId,
      title: req.body.title || req.body.Title,
      artist: req.body.artist || req.body.Artist,
      source: req.body.source || req.body.Source,
      sourceParam: req.body.sourceParam || req.body.SourceParam,
      sourceUrl: req.body.sourceUrl || req.body.SourceUrl,
      imageUrl: req.body.imageUrl || req.body.ImageUrl
    };

    models.Track.create(track).then(function() {
      deferred.resolve();
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  var fetchPlaylist = function() {
    var deferred = when.defer();

    models.Playlist.find({
      where: { id: req.params.id },
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
    }).then(function(playlist) {
      deferred.resolve(playlist);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  ensureCurrentUserCanEdit(req, req.params.id)
  .then(createTrack)
  .then(fetchPlaylist)
  .then(function(modifiedPlaylist) {
    res.status(200).json(modifiedPlaylist);
  }).catch(function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.removeTrack = function(req, res) {

  var deleteTrack = function() {
    var deferred = when.defer();

    models.Track.destroy({ id: req.params.trackId }).then(function() {
      deferred.resolve();
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  ensureCurrentUserCanEdit(req, req.params.playlistId)
  .then(deleteTrack)
  .then(function() {
    res.status(200).json('Track successfully deleted.');
  }).catch(function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.delete = function(req, res) {

  var deletePlaylist = function() {
    var deferred = when.defer();

    models.Playlist.destroy({ id: req.params.id }).then(function() {
      deferred.resolve();
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  ensureCurrentUserCanEdit(req, req.params.id)
  .then(deletePlaylist)
  .then(function() {
    res.status(200).json('Playlist successfully deleted.');
  }).catch(function(err) {
    res.status(err.status).json({ error: err.body });
  });

};