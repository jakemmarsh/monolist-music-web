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

  return gulp.src(config.buildDir + '**/*.{js,css,eot,svg,ttf,woff,otf}')
  .pipe(awspublish.gzip())
  .pipe(publisher.publish())
  .pipe(awspublish.reporter());

});