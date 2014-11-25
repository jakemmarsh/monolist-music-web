'use strict';

var when       = require('when');
var nodemailer = require('nodemailer');
var config     = require('../config');
var transport  = nodemailer.createTransport('SES', {
    AWSAccessKeyID: config.aws.key,
    AWSSecretKey: config.aws.secret
});

/* ====================================================== */

exports.sendActivation = function(user) {

  var deferred = when.defer();
  var mailOptions = {};

  transport.sendMail(mailOptions, function(err, response) {
    if ( err ) {
        deferred.reject(err);
    } else {
        deferred.resolve(response.message);
    }

    transport.close();
  });

  return deferred.promise;

};

/* ====================================================== */

exports.sendReset = function(user) {

  var deferred = when.defer();
  var mailOptions = {};

  transport.sendMail(mailOptions, function(err, response) {
    if ( err ) {
        deferred.reject(err);
    } else {
        deferred.resolve(response.message);
    }

    transport.close();
  });

  return deferred.promise;

};