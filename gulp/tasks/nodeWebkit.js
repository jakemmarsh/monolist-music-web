'use strict';

var gulp      = require('gulp');
var gutil     = require('gulp-util');
var NwBuilder = require('node-webkit-builder');

gulp.task('nodeWebkit', function() {

  var nw = new NwBuilder({
    version: '0.10.4',
    // Read files starting from root directory so that package.json is detected and used
    files: [
      './**/*',
      '!./test/**/*',
      '!./app/**/*',
      '!./cache/**/*',
      '!./gulp/**/*',
      '!./codecs/**/*',
      '!./node_modules/**/*'
    ],
    buildDir: './webkitbuilds',
    //macIcns: './icons/icon.icns',
    platforms: ['osx', 'win']
  });

  nw.on('log', function (msg) {
    gutil.log('node-webkit-builder:', msg);
  });

  return nw.build().catch(function (err) {
    gutil.log('node-webkit-builder:', err);
  });

});