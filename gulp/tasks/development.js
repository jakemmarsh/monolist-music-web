'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('dev', ['clean'], function(callback) {

  callback = callback || function() {};

  global.isProd = false;

  runSequence(['sass', 'imagemin', 'browserify', 'copyFonts', 'copyIndex'], 'watch', callback);

});