'use strict';

var config  = require('../config');
var gulp    = require('gulp');
var replace = require('gulp-replace');

gulp.task('switchAPI', function() {

  return gulp.src(config.scripts.dest + '/**/*.js')
  .pipe(replace(/http:\/\/localhost:3000\/v1\//i, global.apiPath))
  .pipe(gulp.dest(config.scripts.dest));

});