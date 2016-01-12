'use strict';

import gulp        from 'gulp';
import browserSync from 'browser-sync';
import config      from '../config';

gulp.task('copyCss', () => {

  return gulp.src(config.sourceDir + 'styles/vendor/**/*.{css,scss}')
  .pipe(gulp.dest(config.buildDir + 'css/'))
  .pipe(browserSync.stream());

});