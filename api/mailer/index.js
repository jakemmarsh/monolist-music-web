'use strict';

var when           = require('when');
var nodemailer     = require('nodemailer');
var emailTemplates = require('email-templates');
var templatesDir   = require('./templates');
var ses            = require('nodemailer-ses-transport');
var config         = require('../config');
var transport      = nodemailer.createTransport(ses({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret
}));

/* ====================================================== */

exports.sendWelcome = function(user) {

  var deferred = when.defer();
  var mailOptions = {
    from: 'noreply@monolist.co',
    to: user.email,
    subject: 'Welcome to Monolist!'
  };
  var mailData = {
    user: user
  };

  emailTemplates(templatesDir, function(err, template) {
    if ( err ) {
      console.log(err);
    } else {
      template('welcome', mailData, function(err, html, text) {
        mailOptions.html = html;
        mailOptions.text = text;

        transport.sendMail(mailOptions, function(err, response) {
          if ( err ) {
              deferred.reject(err);
          } else {
              deferred.resolve(response.message);
          }
        });
      });
    }
  });

  return deferred.promise;

};

/* ====================================================== */

exports.sendReset = function(user, key) {

  var deferred = when.defer();
  var mailOptions = {
    from: 'noreply@monolist.co',
    to: user.email,
    subject: 'Reset Your Monolist Password'
  };
  var mailData = {
    user: user,
    key: key,
    resetUrl: 'http://www.monolist.co/reset' + user.id + '/' + key
  };

  emailTemplates(templatesDir, function(err, template) {
    if ( err ) {
      console.log(err);
    } else {
      template('reset', mailData, function(err, html, text) {
        mailOptions.html = html;
        mailOptions.text = text;

        transport.sendMail(mailOptions, function(err, response) {
          if ( err ) {
              deferred.reject(err);
          } else {
              deferred.resolve(response.message);
          }
        });
      });
    }
  });

  return deferred.promise;

};