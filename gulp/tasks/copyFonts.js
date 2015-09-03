'use strict';

import gulp        from 'gulp';
import browserSync from 'browser-sync';
import config      from '../config';

gulp.task('copyFonts', () => {

  return gulp.src(config.sourceDir + 'fonts/**/*')
  .pipe(gulp.dest(config.buildDir + 'fonts/'))
  .pipe(browserSync.stream({ once: true }));

});