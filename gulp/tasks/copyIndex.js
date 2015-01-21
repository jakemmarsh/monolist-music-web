'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyIndex', function() {

  return gulp.src([
    config.sourceDir + 'index.html',
    config.sourceDir + 'nwIndex.js',
    config.sourceDir + 'package.json',
    config.sourceDir + 'catchExceptions.js'
  ])
  .pipe(gulp.dest(config.buildDir));

});