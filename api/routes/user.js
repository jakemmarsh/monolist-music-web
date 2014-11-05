'use strict';

var Q = require('q');

/* ====================================================== */

exports.get = function(req, res) {

  var getUser = function(id) {
    var deferred = Q.defer();

    req.models.user.get(id, function(err, user) {
      if ( err || !user ) {
        deferred.reject(err || 'Unable to retrieve user at ID: ', id);
      } else {
        deferred.resolve(user);
      }
    });

    return deferred.promise;
  };

  getUser(req.params.id).then(function(user) {
    res.status(200).json(user);
  }, function(err) {
    res.status(500).send(err);
  });

};

/* ====================================================== */

exports.create = function(req, res) {

  var createUser = function(user) {
    var deferred = Q.defer();
    var dbUser = new req.models.user(user);

    dbUser.save(function(err) {
      if ( err ) {
        deferred.reject(err);
      }  else {
        deferred.resolve(dbUser);
      }
    });

    return deferred.promise;
  };

  createUser(req.body).then(function(resp) {
    res.status(200).json(resp);
  }, function(err) {
    res.status(500).send(err);
  });

};

/* ====================================================== */

exports.delete = function(req, res) {

  var deleteUser = function(id) {
    var deferred = Q.defer();

    req.models.user.get(id).remove(function(err) {
      if ( err ) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  };

  deleteUser(req.params.id).then(function() {
    res.status(200).send('User successfully deleted.');
  }, function(err) {
    res.status(500).send(err);
  });

};