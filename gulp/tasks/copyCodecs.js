'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyCodecs', function() {

  // Windows codecs
  gulp.src(config.codecs.src + 'win/**/*.dll')
  .pipe(gulp.dest(config.codecs.dest + 'win32/'));

  gulp.src(config.codecs.src + 'win/**/*.dll')
  .pipe(gulp.dest(config.codecs.dest + 'win64/'));

  // OSX codecs
  gulp.src(config.codecs.src + 'osx/**/*.so')
  .pipe(gulp.dest(config.codecs.dest + 'osx32/'));

  return gulp.src(config.codecs.src + 'osx/**/*.so')
  .pipe(gulp.dest(config.codecs.dest + 'osx64/'));

});