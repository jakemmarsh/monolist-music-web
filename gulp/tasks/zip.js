'use strict';

var gulp = require('gulp');
var zip  = require('gulp-zip');

gulp.task('zip', function() {

  return gulp.src('./releases/win/*.exe')
  .pipe(zip('Monolist.zip'))
  .pipe(gulp.dest('./releases/win'));

});