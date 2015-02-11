'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyIcon', function() {

  gulp.src('./dist/icon.ico')
  .pipe(gulp.dest(config.codecs.dest + 'Monolist/win32/'));

  return gulp.src('./dist/icon.ico')
  .pipe(gulp.dest('./cache/' + config.nwVersion + '/win32/'));

});