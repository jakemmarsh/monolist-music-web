'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('prod', ['clean'], function(callback) {

  callback = callback || function() {};

  global.isProd = true;

  runSequence(
    'sass',
    'imagemin',
    'browserify',
    'copyFonts',
    'copyIndex',
    'switchAPI',
    'modifyNwOptions',
    'nodeWebkit',
    'copyCodecs',
    'copyIcon',
    'createInstallers',
    'createUpdaters',
    'zipWinInstaller',
    'deploy',
    callback
  );

});