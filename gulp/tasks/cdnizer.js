'use strict';

var gulp    = require('gulp');
var cdnizer = require("gulp-cdnizer");
var config  = require('../config');

gulp.task('cdnizer', function() {

  return gulp.src(config.buildDir + 'index.html')
  .pipe(cdnizer({
    defaultCDNBase: '//assets.monolist.co/',
    files: ['**/*.{gif,png,jpg,jpeg,css,js}']
  }))
  .pipe(gulp.dest(config.buildDir));

});