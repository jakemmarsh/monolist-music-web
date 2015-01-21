'use strict';

var gulp = require('gulp');
var zip  = require('gulp-zip');

gulp.task('createUpdaters', function() {

  gulp.src('./webkitbuilds/Monolist/osx32/**/*')
  .pipe(zip('mac.zip'))
  .pipe(gulp.dest('./updates'));

  return gulp.src('./webkitbuilds/Monolist/win32/**/*')
  .pipe(zip('win.zip'))
  .pipe(gulp.dest('./updates'));

});