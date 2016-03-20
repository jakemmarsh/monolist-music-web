'use strict';

import gulp    from 'gulp';
import replace from 'gulp-replace';
import config  from '../config';

gulp.task('updateEnv', () => {

  return gulp.src(config.buildDir + 'index.html')
  .pipe(replace(/data-env="development"/gi, 'data-env="production"'))
  .pipe(gulp.dest(config.buildDir));

});
