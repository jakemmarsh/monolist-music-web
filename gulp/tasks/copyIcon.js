'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyIcon', function() {

  return gulp.src(['./dist/icon.ico'])
  .pipe(gulp.dest(config.buildDir));

});