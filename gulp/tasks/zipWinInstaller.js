'use strict';

var gulp           = require('gulp');
var zip            = require('gulp-zip');
var p              = require('../../package.json');
var currentVersion = p.version;

gulp.task('zipWinInstaller', function() {

  // Zip windows installer to prevent .exe unsafe warning on download
  return gulp.src('./releases/win/*.exe')
  .pipe(zip('Monolist-' + currentVersion + '-win.zip'))
  .pipe(gulp.dest('./releases/win'));

});