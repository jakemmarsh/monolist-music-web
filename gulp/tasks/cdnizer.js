'use strict';

import gulp    from 'gulp';
import cdnizer from "gulp-cdnizer";
import config  from '../config';

gulp.task('cdnizer', () => {

  let cdnBase = '//assets.monolist.co/app/';

  gulp.src(config.buildDir + 'css/**/*.css')
  .pipe(cdnizer({
      defaultCDNBase: cdnBase,
      relativeRoot: 'css',
      files: ['**/*.{gif,png,jpg,jpeg,eot,svg,ttf,woff}']
  }))
  .pipe(gulp.dest(config.styles.dest));

  return gulp.src(config.buildDir + 'index.html')
  .pipe(cdnizer({
    defaultCDNBase: cdnBase,
    files: ['css/*.css', 'js/*.js']
  }))
  .pipe(gulp.dest(config.buildDir));

});