'use strict';

var gulp         = require('gulp');
var rename       = require('gulp-rename');
var awspublish   = require('gulp-awspublish');
var config       = require('../config');
var globalConfig = require('../../config');

gulp.task('deploy', function() {

  var publisher = awspublish.create({
    key: globalConfig.aws.key,
    secret: globalConfig.aws.secret,
    bucket: globalConfig.aws.bucket
  });
  var oneWeekInSeconds = 60*60*24*7;
  var headers = {
    'Cache-Control': 'max-age=' + oneWeekInSeconds + ', no-transform, public'
  };

  // Assets
  return gulp.src([
    config.buildDir + '**/*.{json,js,css,eot,svg,ttf,woff,otf,png,jpg,jpeg}',
    '!' + config.buildDir + 'catchExceptions.js'
  ])
  .pipe(rename(function(path) {
    path.dirname = 'app/' + path.dirname;
  }))
  .pipe(awspublish.gzip())
  .pipe(publisher.publish(headers))
  .pipe(awspublish.reporter());

  // Installers
  return gulp.src('./releases/**/*.{zip,dmg}')
  .pipe(rename(function(path) {
    path.dirname = 'releases/' + path.dirname;
  }))
  .pipe(publisher.publish())
  .pipe(awspublish.reporter());

});