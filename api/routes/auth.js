'use strict';

var when   = require('when');
var bcrypt = require('bcrypt');
var models = require('../models');

/* ====================================================== */

exports.isAuthenticated = function(req, res, next) {

  if ( req.isAuthenticated() || (req.session && req.session.user) ) {
    return next();
  } else {
    return res.status(401).json({
      error: 'User must be logged in.'
    });
  }

};

/* ====================================================== */

exports.isAdmin = function(req, res, next) {

  if ( req.user && req.user.role === 'admin' ) {
    return next();
  } else {
    return res.status(401).json({
      error: 'User must be an admin.'
    });
  }

};

/* ====================================================== */

exports.register = function(req, res) {

  var createUser = function(user) {
    var deferred = when.defer();

    bcrypt.hash(user.password, 10, function(err, hash) {
      if ( err ) {
        deferred.reject({
          status: 500,
          error: err
        });
      } else {
        user.hash = hash;
        delete user.password;

        console.log('about to create user:', user);

        models.User.create(user).then(function(savedUser) {
          deferred.resolve(savedUser);
        }).catch(function(err) {
          console.log('error creating user:', err);
          deferred.reject({
            status: 500,
            error: err
          });
        });
      }
    });

    return deferred.promise;
  };

  createUser(req.body).then(function(user) {
    res.status(200).json(user);
  }, function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.login = function(req, res) {

  req.session.cookie.maxAge = 1000*60*60*24*7; // seven days
  res.status(200).json(req.user);

};

/* ====================================================== */

exports.logout = function(req, res) {

  req.logout();
  res.status(200).json({
    message: 'User successfully logged out.'
  });

};