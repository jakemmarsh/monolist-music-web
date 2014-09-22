'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('prod', function(callback) {

  callback = callback || function() {};

  global.isProd = true;

  runSequence('sass', 'imagemin', 'browserify', 'copyFonts', 'copyIndex', 'deploy', callback);

});