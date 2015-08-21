'use strict';

import gulp    from 'gulp';
import replace from 'gulp-replace';
import config  from '../config';

gulp.task('switchAPI', () => {

  return gulp.src(config.scripts.dest + '/**/*.js')
  .pipe(replace(/http:\/\/localhost:3000\/v1\//i, global.apiPath))
  .pipe(gulp.dest(config.scripts.dest));

});