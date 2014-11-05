'use strict';

var Q   = require('q');

/* ====================================================== */

exports.get = function(req, res) {

  var getPlaylist = function(id) {
    var deferred = Q.defer();

    req.models.playlist.get(id, function(err, playlist) {
      if ( err || !playlist ) {
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

  var createPlaylist = function(playlist) {
    var deferred = Q.defer();
    var dbPlaylist = new req.models.playlist(playlist);

    dbPlaylist.save(function(err) {
      if ( err ) {
        deferred.reject(err);
      }  else {
        deferred.resolve(dbPlaylist);
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
    var deferred = Q.defer();
    var dbTrack = new req.models.track(track);

    req.models.playlist.get(id).addTrack(dbTrack, function(err, playlist) {
      if ( err ) {
        deferred.reject(err);
      } else {
        deferred.resolve(playlist);
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

exports.delete = function(req, res) {

  var deletePlaylist = function(id) {
    var deferred = Q.defer();

    req.models.playlist.get(id).remove(function(err) {
      if ( err ) {
        deferred.reject(err);
      } else {
        deferred.resolve();
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