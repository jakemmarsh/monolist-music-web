'use strict';

var gulp      = require('gulp');
var gutil     = require('gulp-util');
var NwBuilder = require('node-webkit-builder');
var config    = require('../config');

gulp.task('nodeWebkit', function() {

  var nw = new NwBuilder({
    version: '0.11.0',
    files: config.buildDir + '**/*',
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