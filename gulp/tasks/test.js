'use strict';

var gulp   = require('gulp');
var jsdom  = require('jsdom').jsdom;
var argv   = require('yargs').argv;
var config = require('../config');

gulp.task('test', function() {

  // Ensure that all window/DOM related properties
  // are available to all tests
  global.document = jsdom('<!DOCTYPE html><html><body></body></html>');
  global.window = document.parentWindow;
  global.location = { href: '' };
  global.navigator = {};
  global.navigator.userAgent = 'jsdom';
  global.navigator.appVersion = '';

  return (require('gulp-jsx-coverage').createTask({
    src: [argv.f || argv.file || config.tests],

    istanbul: {
      coverageVariable: '__MY_TEST_COVERAGE__',
      exclude: /node_modules|__tests__|build|gulp|createAuthenticatedSuite|testHelpers/
    },

    transpile: {
      babel: {
        include: /\.jsx?$/,
        exclude: /node_modules/
      }
    },

    coverage: {
      reporters: ['text-summary', 'html'],
      directory: '__coverage__'
    },

    mocha: {
      reporter: 'spec'
    },

    babel: {
      sourceMap: 'inline'
    }
  }))();

});