'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyIcons', function() {

  return gulp.src(['./*.png', './favicon.ico'])
  .pipe(gulp.dest(config.buildDir));

});