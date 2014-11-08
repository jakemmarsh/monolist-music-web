'use strict';

var when = require('when');
var _    = require('underscore');

/* ====================================================== */

exports.get = function(req, res) {

  var getPlaylist = function(id) {
    var deferred = when.defer();

    req.models.playlist.get(id, function(err, playlist) {
      if ( err || _.isEmpty(playlist) ) {
        deferred.reject(err || 'Unable to retrieve playlist at ID: ' + id);
      } else {
        deferred.resolve(playlist);
      }
    });

    return deferred.promise;
  };

  getPlaylist(req.params.id).then(function(playlist) {
    res.status(200).json(playlist);
  }, function(err) {
    res.status(500).send(err);
  });

};

/* ====================================================== */

exports.create = function(req, res) {

  console.log('inside create');

  var createPlaylist = function(playlist) {
    var deferred = when.defer();
    var dbPlaylist = new req.models.playlist(playlist);

    console.log('db playlist:', dbPlaylist);

    dbPlaylist.save(function(err, savedPlaylist) {
      console.log('inside save');
      if ( err ) {
        console.log('error:', err);
        deferred.reject(err);
      }  else {
        deferred.resolve(savedPlaylist);
      }
    });

    return deferred.promise;
  };

  createPlaylist(req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(500).send(err);
  });

};

/* ====================================================== */

exports.addTrack = function(req, res) {

  var createTrack = function(id, track) {
    var deferred = when.defer();
    var dbTrack = new req.models.track(track);

    dbTrack.save(function(err, savedTrack) {
      if ( err ) {
        deferred.reject(err);
      } else {
        req.models.playlist.get(id, function(err, playlist) {
          if ( err ) {
            deferred.reject(err);
          } else {
            savedTrack.setPlaylist(playlist, function(err) {
              if ( err ) {
                deferred.reject(err);
              } else {
                deferred.resolve(playlist);
              }
            });
          }
        });
      }
    });

    return deferred.promise;
  };

  createTrack(req.params.id, req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(500).send(err);
  });

};

/* ====================================================== */

exports.removeTrack = function(req, res) {

  var deleteTrack = function(playlistId, trackId) {
    var deferred = when.defer();

    req.models.track.get(trackId, function(err, retrievedTrack) {
      if ( err ) {
        deferred.reject(err);
      } else {
        retrievedTrack.remove(function(err) {
          if ( err ) {
            deferred.reject(err);
          } else {
            deferred.resolve();
          }
        });
      }
    });

    return deferred.promise;
  };

  deleteTrack(req.params.playlistId, req.params.trackId).then(function() {
    res.status(200).send('Track successfully deleted.');
  }, function(err) {
    res.status(500).send(err);
  });

};

/* ====================================================== */

exports.delete = function(req, res) {

  var deletePlaylist = function(id) {
    var deferred = when.defer();

    req.models.playlist.get(id, function(err, retrievedPlaylist) {
      if ( err ) {
        deferred.reject(err);
      } else {
        retrievedPlaylist.remove(function(err) {
          if ( err ) {
            deferred.reject(err);
          } else {
            req.models.track.find({ playlist_id: id }).remove(function(err) {
              if ( err ) {
                deferred.reject(err);
              } else {
                deferred.resolve();
              }
            });
          }
        });
      }
    });

    return deferred.promise;
  };

  deletePlaylist(req.params.id).then(function() {
    res.status(200).send('Playlist successfully deleted.');
  }, function(err) {
    res.status(500).send(err);
  });

};