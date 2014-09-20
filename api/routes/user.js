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