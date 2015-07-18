'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');
var shell       = require('gulp-shell');

gulp.task('dev', ['clean'], function() {

  var startServer = function() {
    return gulp.src('')
      .pipe(shell('supervisor server.js'));
  };

  global.isProd = false;

  runSequence(['sass', 'imagemin', 'browserify', 'copyFonts', 'copyIndex'], 'watch', startServer);

});