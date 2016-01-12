'use strict';

import gulp        from 'gulp';
import browserSync from 'browser-sync';
import config      from '../config';

gulp.task('copyIndex', () => {

  return gulp.src(config.sourceDir + 'index.html')
  .pipe(gulp.dest(config.buildDir))
  .pipe(browserSync.stream());

});