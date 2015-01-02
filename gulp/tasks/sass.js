'use strict';

var gulp         = require('gulp');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var handleErrors = require('../util/handle-errors');
var config       = require('../config');

gulp.task('sass', function() {

  return gulp.src(config.sourceDir + 'styles/main.scss')
  .pipe(sass({
    outputStyle: global.isProd ? 'compressed' : 'nested',
    onError: function(err) {
      // Prevent crashing on error
      console.log('SASS error:', err);
    }
  }))
  .pipe(rename({suffix: '.min'}))
  .on('error', handleErrors)
  .pipe(gulp.dest(config.styles.dest));

});