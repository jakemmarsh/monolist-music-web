'use strict';

import gulp        from 'gulp';
import rename      from 'gulp-rename';
import awspublish  from 'gulp-awspublish';
// import {argv}      from 'yargs';
import shell       from 'gulp-shell';
import runSequence from 'run-sequence';
import config      from '../config';

gulp.task('deploy', ['prod'], () => {

  // let isProd = argv.production || argv.prod;

  let deploy = function() {
    let publisher = awspublish.create({
      key: process.env.AWS_KEY,
      secret: process.env.AWS_SECRET,
      bucket: process.env.S3_BUCKET
    });
    let oneWeekInSeconds = 60*60*24*7;
    let headers = {
      'Cache-Control': 'max-age=' + oneWeekInSeconds + ', no-transform, public'
    };
    let ebsDeployString = 'ebs-deploy deploy --environment ';

    // if ( isProd ) {
    //   ebsDeployString += 'monolist-app-prod';
    // } else {
    ebsDeployString += 'monolist-app-staging';
    // }

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
  };

  // global.apiPath = isProd ? config.api.prod : config.api.dev;
  global.apiPath = config.api.prod;

  return runSequence('switchAPI', deploy);

});