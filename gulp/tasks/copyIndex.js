'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyIndex', function() {

  return gulp.src([
    config.sourceDir + 'index.html',
    config.sourceDir + 'package.json',
    config.sourceDir + 'catchExceptions.js',
    config.sourceDir + 'icon.png'
  ])
  .pipe(gulp.dest(config.buildDir));

});