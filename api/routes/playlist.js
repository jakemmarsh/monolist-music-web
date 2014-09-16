'use strict';

var Q   = require('q');

/* ====================================================== */

exports.get = function(req, res) {

  var getPlaylist = function(id) {
    var deferred = Q.defer();

    req.models.playlist.get(id, function(err, playlist) {
      if ( err || !playlist ) {
        deferred.reject('Unable to retrieve playlist at ID: '+id);
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