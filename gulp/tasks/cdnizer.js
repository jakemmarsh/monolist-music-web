'use strict';

var gulp    = require('gulp');
var cdnizer = require("gulp-cdnizer");
var config  = require('../config');

gulp.task('cdnizer', function() {

  var cdnBase = '//assets.monolist.co/';

  gulp.src(config.buildDir + 'css/**/*.css')
  .pipe(cdnizer({
      defaultCDNBase: cdnBase,
      relativeRoot: 'css',
      files: ['**/*.{gif,png,jpg,jpeg}']
  }))
  .pipe(gulp.dest(config.buildDir + 'css'));

  return gulp.src([config.buildDir + 'index.html'])
  .pipe(cdnizer({
    defaultCDNBase: cdnBase,
    files: ['**/*.{js,css}']
  }))
  .pipe(gulp.dest(config.buildDir));

});