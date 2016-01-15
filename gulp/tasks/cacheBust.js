'use strict';

import gulp      from 'gulp';
import cacheBust from 'gulp-cache-bust';
import replace   from 'gulp-replace';
import config    from '../config';

gulp.task('cacheBust', () => {

  return gulp.src(config.buildDir + 'index.html')
  .pipe(cacheBust({
    type: 'timestamp'
  }))
  // hack to ensure that Mixpanel's code doesn't get fucked up
  // TODO: fix this
  .pipe(replace(/undefined(\?t=[\d]*)+/gi, 'undefined'))
  .pipe(gulp.dest(config.buildDir));

});