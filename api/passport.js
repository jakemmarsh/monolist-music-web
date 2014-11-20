'use strict';

var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models        = require('./models');

/* ====================================================== */

module.exports = function() {

  passport.use(new LocalStrategy(
    function(username, password, done) {
      models.User.find({ username: username }).then(function(retrievedUser) {
        retrievedUser.verifyPassword(password, function(err, result) {
          if ( err || !result ) {
            return done(null, false, { message: 'Incorrect password.' } );
          } else {
            return done(null, retrievedUser);
          }
        });
      }).catch(function(err) {
        return done(null, false, { message: err });
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    console.log('seralize:', user);
    done(null, user.username);
  });

  passport.deserializeUser(function(username, done) {
    models.User.find({ username: username }).then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err, null);
    });
  });

};