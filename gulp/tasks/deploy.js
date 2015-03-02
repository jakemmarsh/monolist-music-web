'use strict';

var gulp         = require('gulp');
var rename       = require('gulp-rename');
var awspublish   = require('gulp-awspublish');
var dotenv       = require('dotenv');
var config       = require('../config');

dotenv.load();

gulp.task('deploy', ['prod'], function() {

  var publisher = awspublish.create({
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SECRET,
    bucket: process.env.S3_BUCKET
  });
  var oneWeekInSeconds = 60*60*24*7;
  var headers = {
    'Cache-Control': 'max-age=' + oneWeekInSeconds + ', no-transform, public'
  };

  // Assets
  gulp.src([
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