'use strict';

var config  = require('../config');
var gulp    = require('gulp');
var replace = require('gulp-replace');

gulp.task('switchFb', function() {

  var devRegEx = new RegExp(process.env.FB_DEV_ID, 'gi');

  return gulp.src(config.scripts.dest + '**/*.js')
  .pipe(replace(devRegEx, process.env.FB_PROD_ID))
  .pipe(gulp.dest(config.scripts.dest));

});