'use strict';

var _      = require('underscore');
var bcrypt = require('bcrypt');

/* ====================================================== */

exports.login = function(req, res) {

  var loginUser = function(credentials) {
    var user;

    console.log('credentials:', credentials);

    req.models.user.find({ username: credentials.username }, 1, function(err, retrievedUsers) {
      if ( err || _.isEmpty(retrievedUsers) ) {
        console.log('error finding user:', err);
        res.status(404).send(err || ('Unable to retrieve user with username: ' + credentials.username));
      } else {
        user = retrievedUsers[0];
        bcrypt.compare(credentials.password, user.hash, function(err, result) {
          if ( err || !result ) {
            console.log('err checking hash:', err);
            res.status(403).send(err || 'Password does not match.');
          } else {
            res.status(200).json(user);
          }
        });
      }
    });
  };

  loginUser(req.body);

};

/* ====================================================== */

exports.register = function(req, res) {

  var createUser = function(user) {
    var dbUser;

    bcrypt.hash(user.password, 10, function(err, hash) {
      if ( err ) {
        console.log('error hashing password:', err);
        res.status(500).send(err);
      } else {
        user.hash = hash;
        dbUser = new req.models.user(user);

        dbUser.save(function(err, savedUser) {
          if ( err ) {
            console.log('err saving user:', err);
            res.status(500).send(err);
          } else {
            res.status(200).json(savedUser);
          }
        });
      }
    });
  };

  createUser(req.body);

};