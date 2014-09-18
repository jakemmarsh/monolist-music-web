'use strict';

var gulp         = require('gulp');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var handleErrors = require('../util/handle-errors');
var config       = require('../config');

gulp.task('sass', function() {

  return gulp.src(config.sourceDir + 'styles/main.scss')
    // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
    .pipe(sass({
      sourceComments: 'map',
      sourceMap: 'sass',
      style: global.isProd ? 'compressed' : 'expanded'
    }))
    .on('error', handleErrors)
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.styles.dest));

});