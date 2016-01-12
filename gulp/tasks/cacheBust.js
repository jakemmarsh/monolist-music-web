'use strict';

import gulp      from 'gulp';
import cacheBust from 'gulp-cache-bust';
import config    from '../config';

gulp.task('cacheBust', () => {

  return gulp.src(config.buildDir + 'index.html')
  .pipe(cacheBust({
    type: 'timestamp'
  }))
  .pipe(gulp.dest(config.buildDir));

});