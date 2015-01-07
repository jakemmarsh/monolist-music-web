'use strict';

var gulp    = require('gulp');
var jeditor = require('gulp-json-editor');
var config  = require('../config');

gulp.task('modifyNwOptions', function() {

  return gulp.src(config.buildDir + 'package.json')
  .pipe(jeditor({
    'window': {
      'toolbar': false,
      'frame': false
    }
  }))
  .pipe(gulp.dest(config.buildDir));

});