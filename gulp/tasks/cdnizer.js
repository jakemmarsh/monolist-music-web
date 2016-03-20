'use strict';

import gulp    from 'gulp';
import cdnizer from 'gulp-cdnizer';
import config  from '../config';

gulp.task('cdnizer', () => {

  const CDN_BASE = '//assets.monolist.co/app/';

  gulp.src(config.buildDir + 'css/**/*.css')
  .pipe(cdnizer({
      defaultCDNBase: CDN_BASE,
      relativeRoot: 'css',
      files: ['**/*.{gif,png,jpg,jpeg,eot,svg,ttf,woff}']
  }))
  .pipe(gulp.dest(config.styles.dest));

  return gulp.src(config.buildDir + 'index.html')
  .pipe(cdnizer({
    defaultCDNBase: CDN_BASE,
    files: ['css/*.css', 'js/*.js'],
    allowRev: true
  }))
  .pipe(gulp.dest(config.buildDir));

});
