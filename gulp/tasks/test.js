'use strict';

import gulp    from 'gulp';
import {jsdom} from 'jsdom';
import {argv}  from 'yargs';
import config  from '../config';

gulp.task('test', () => {

  let files;

  // Include top-level helper even when running specific tests
  if ( argv.f || argv.file ) {
    files = ['__tests__/helper.js', argv.f || argv.file];
  } else {
    files = [config.tests];
  }

  // Ensure that all window/DOM related properties
  // are available to all tests
  global.document = jsdom('<!DOCTYPE html><html><body></body></html>');
  global.window = document.parentWindow;
  global.location = { href: '' };
  global.navigator = {};
  global.navigator.userAgent = 'jsdom';
  global.navigator.appVersion = '';

  // Ensure that 'should' and 'sinon' library methods will be
  // available to all tests
  global.Should = require('should');
  global.sinon = require('sinon');

  return (require('gulp-jsx-coverage').createTask({
    src: files,

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
      directory: 'shippable/codecoverage/'
    },

    mocha: {
      reporter: 'spec'
    },

    babel: {
      sourceMap: 'both'
    },

    cleanup: () => {
      process.exit(0);
    }
  }))();

});