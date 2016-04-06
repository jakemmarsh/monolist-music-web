'use strict';

import gulp    from 'gulp';
import {jsdom} from 'jsdom';
import {argv}  from 'yargs';
import mocha   from 'gulp-mocha';
import babel   from 'babel-register';
import config  from '../config';

gulp.task('test', () => {

  let files;

  // Include top-level helper even when running specific tests
  if ( argv.f || argv.file ) {
    let singleFile = argv.f || argv.file;
    if ( singleFile.indexOf('__tests__/') === -1 ) { singleFile = '__tests__/' + singleFile; }
    if ( singleFile.indexOf('.spec.js') === -1 ) { singleFile += '.spec.js'; }
    files = ['__tests__/helper.js', singleFile];
  } else {
    files = [config.tests];
  }

  // Ensure that all window/DOM related properties
  // are available to all tests
  global.document = jsdom('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost'
  });
  global.window = document.defaultView;
  global.navigator = window.navigator;
  global.KeyboardEvent = window.KeyboardEvent;

  // Ensure that 'should' and 'sinon' library methods will be
  // available to all tests
  global.Should = require('should');
  global.sinon = require('sinon');
  global.assert = require('chai').assert;

  return gulp.src(files)
  .pipe(mocha({
    compilers: {
      js: babel
    }
  }));

});
