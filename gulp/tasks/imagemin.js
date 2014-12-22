'use strict';

var gulp     = require('gulp');
var gulpif   = require('gulp-if');
var imagemin = require('gulp-imagemin');
var config   = require('../config');

gulp.task('imagemin', function() {

  return gulp.src(config.images.src)
  .pipe(gulpif(global.isProd, imagemin()))
  .pipe(gulp.dest(config.images.dest));

});