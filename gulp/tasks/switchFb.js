'use strict';

import gulp    from 'gulp';
import replace from 'gulp-replace';
import config  from '../config';

gulp.task('switchFb', () => {

  const devRegEx = new RegExp(process.env.FB_DEV_ID, 'gi');

  return gulp.src(config.scripts.dest + '**/*.js')
  .pipe(replace(devRegEx, process.env.FB_PROD_ID))
  .pipe(gulp.dest(config.scripts.dest));

});
