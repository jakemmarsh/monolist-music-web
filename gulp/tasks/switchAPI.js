'use strict';

var config  = require('../config');
var gulp    = require('gulp');
var gulpif  = require('gulp-if');
var replace = require('gulp-replace');

gulp.task('switchAPI', function() {

  return gulp.src(config.scripts.dest + '/**/*.js')
  .pipe(gulpif(global.isProd, replace(/http:\/\/localhost:3000\/api\/v1\//i, 'https://monolist.co/api/v1/')))
  .pipe(gulp.dest(config.scripts.dest));

});