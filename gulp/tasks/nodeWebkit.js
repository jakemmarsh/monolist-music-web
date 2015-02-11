'use strict';

var gulp      = require('gulp');
var gutil     = require('gulp-util');
var NwBuilder = require('node-webkit-builder');
var config    = require('../config');

gulp.task('nodeWebkit', function() {

  var nw = new NwBuilder({
    version: config.nwVersion,
    files: [
      './build/package.json',
      './build/catchExceptions.js',
      './build/index.html',
      './build/icon.png'
    ], // only include crucial files since all other assets are served from S3
    buildDir: config.webkitBuildDir,
    macIcns: './dist/mac/monolist.icns',
    winIco: './dist/icon.ico', // Must have Wine installed (if on OSX) for this option to work
    platforms: ['osx32', 'win32']
  });

  nw.on('log', function (msg) {
    gutil.log('node-webkit-builder log:', msg);
  });

  return nw.build().catch(function (err) {
    gutil.log('node-webkit-builder err:', err);
  });

});