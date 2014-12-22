'use strict';

var gulp    = require('gulp');
var replace = require('gulp-replace');
var config  = require('../config');

gulp.task('replaceAPIUrl', function() {

  return gulp.src(config.buildDir + 'js/**/*.js')
  .pipe(replace(/(\/api\/v1\/)/i, '//api.monolist.co/'))
  .pipe(gulp.dest(config.buildDir + 'js'));

});