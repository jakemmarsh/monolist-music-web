'use strict';

var gulp         = require('gulp');
var awspublish   = require('gulp-awspublish');
var config       = require('../config');
var globalConfig = require('../../config');

gulp.task('deploy', function() {

  var publisher = awspublish.create({
    key: globalConfig.aws.key,
    secret: globalConfig.aws.secret,
    bucket: globalConfig.aws.bucket
  });
  var twoWeeksInSeconds = 60*60*24*7*2;
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'max-age=' + twoWeeksInSeconds + ', no-transform, public'
  };

  return gulp.src(config.buildDir + '**/*.{js,css,eot,svg,ttf,woff,otf,png,jpg,jpeg}')
  .pipe(awspublish.gzip())
  .pipe(publisher.publish(headers))
  .pipe(awspublish.reporter());

});