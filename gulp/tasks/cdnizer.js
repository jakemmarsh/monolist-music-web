'use strict';

var gulp    = require('gulp');
var cdnizer = require("gulp-cdnizer");
var config  = require('../config');

gulp.task('cdnizer', function() {

  var cdnBase = 'https://assets.monolist.co/app/';

  gulp.src(config.buildDir + 'css/**/*.css')
  .pipe(cdnizer({
      defaultCDNBase: cdnBase,
      relativeRoot: 'css',
      files: ['**/*.{gif,png,jpg,jpeg,eot,svg,ttf,woff}']
  }))
  .pipe(gulp.dest(config.styles.dest));

  return gulp.src(config.buildDir + 'index.html')
  .pipe(cdnizer({
    defaultCDNBase: cdnBase,
    files: ['**/*.{js,css}']
  }))
  .pipe(gulp.dest(config.buildDir));

});