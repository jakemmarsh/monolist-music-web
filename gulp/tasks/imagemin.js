'use strict';

import gulp        from 'gulp';
import gulpif      from 'gulp-if';
import imagemin    from 'gulp-imagemin';
import browserSync from 'browser-sync';
import config      from '../config';

gulp.task('imagemin', () => {

  return gulp.src(config.images.src)
  .pipe(gulpif(global.isProd, imagemin()))
  .pipe(gulp.dest(config.images.dest))
  .pipe(browserSync.stream());

});