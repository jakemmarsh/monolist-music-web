'use strict';

var gulp       = require('gulp');
var rename     = require('gulp-rename');
var awspublish = require('gulp-awspublish');
var argv       = require('yargs').argv;
var shell      = require('gulp-shell');
var config     = require('../config');

gulp.task('deploy', ['prod'], function() {

  var isProd = argv.production || argv.prod;
  var publisher = awspublish.create({
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SECRET,
    bucket: process.env.S3_BUCKET
  });
  var oneWeekInSeconds = 60*60*24*7;
  var headers = {
    'Cache-Control': 'max-age=' + oneWeekInSeconds + ', no-transform, public'
  };
  var ebsDeployString = 'ebs-deploy deploy --environment ';

  // TODO: use zero-downtime deployment for prod ('ebs zdt_deploy')
  if ( isProd ) {
    ebsDeployString += 'monolist-app-prod';
  } else {
    ebsDeployString += 'monolist-app-dev';
  }

  // Assets to S3
  gulp.src(config.buildDir + '**/*.{json,js,css,eot,svg,ttf,woff,woff2,otf,png,jpg,jpeg}')
  .pipe(rename(function(path) {
    path.dirname = 'app/' + path.dirname;
  }))
  .pipe(awspublish.gzip())
  .pipe(publisher.publish(headers))
  .pipe(awspublish.reporter());

  // Application to EBS
  return gulp.src('')
  .pipe(shell(ebsDeployString));

});