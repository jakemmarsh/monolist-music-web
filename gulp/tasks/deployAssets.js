'use strict';

import gulp        from 'gulp';
import rename      from 'gulp-rename';
import awspublish  from 'gulp-awspublish';
import config      from '../config';

gulp.task('deployAssets', () => {

  const publisher = awspublish.create({
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SECRET,
    bucket: process.env.S3_BUCKET
  });
  const oneWeekInSeconds = 60*60*24*7;
  const headers = {
    'Cache-Control': 'max-age=' + oneWeekInSeconds + ', no-transform, public'
  };

  // Assets to S3
  return gulp.src(config.buildDir + '**/*.{json,js,css,eot,svg,ttf,woff,woff2,otf,png,jpg,jpeg}')
  .pipe(rename(function(path) {
    path.dirname = 'app/' + path.dirname;
  }))
  .pipe(awspublish.gzip())
  .pipe(publisher.publish(headers))
  .pipe(awspublish.reporter());

});
