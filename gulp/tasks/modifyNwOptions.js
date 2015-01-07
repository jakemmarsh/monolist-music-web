'use strict';

var gulp    = require('gulp');
var gulpif  = require('gulp-if');
var jeditor = require('gulp-json-editor');
var config  = require('../config');

gulp.task('modifyNwOptions', function() {

  return gulp.src(config.buildDir + 'package.json')
  .pipe(gulpif(global.isProd, jeditor({
    'window': {
      'toolbar': false,
      'frame': false
    }
  })))
  .pipe(gulp.dest(config.buildDir));

});