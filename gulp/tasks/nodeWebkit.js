'use strict';

var gulp      = require('gulp');
var gutil     = require('gulp-util');
var NwBuilder = require('node-webkit-builder');
var config    = require('../config');

gulp.task('nodeWebkit', function() {

  var nw = new NwBuilder({
    version: config.nwVersion,
    files: ['./build/**/*.{html,json}', './build/catchExceptions.js'],
    buildDir: config.webkitBuildDir,
    macIcns: './dist/mac/monolist.icns',
    winIco: './dist/icon.ico', // Must have Wine installed (if on OSX) for this option to work
    platforms: ['osx32', 'win32'/*, 'osx64', 'win64'*/]
  });

  nw.on('log', function (msg) {
    gutil.log('node-webkit-builder:', msg);
  });

  return nw.build().catch(function (err) {
    gutil.log('node-webkit-builder:', err);
  });

});