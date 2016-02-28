'use strict';

import gulp         from 'gulp';
import gulpif       from 'gulp-if';
import rev          from 'gulp-rev';
import rename       from 'gulp-rename';
import sass         from 'gulp-sass';
import browserSync  from 'browser-sync';
import handleErrors from '../util/handle-errors';
import config       from '../config';

gulp.task('sass', ['copyCss'], () => {

  return gulp.src(config.sourceDir + 'styles/main.scss')
  .pipe(sass({
    sourceComments: !global.isProd,
    outputStyle: global.isProd ? 'compressed' : 'nested',
    onError: (err) => {
      // Prevent crashing on error
      console.log('SASS error:', err);
    }
  }))
  .pipe(rename({ basename: 'bundle' }))
  .on('error', handleErrors)
  .pipe(gulpif(global.isProd, rev()))
  .pipe(gulp.dest(config.styles.dest))
  .pipe(gulpif(global.isProd, rev.manifest(config.buildDir + 'rev-manifest.json', {
    base: config.buildDir,
    merge: true
  })))
  .pipe(gulpif(global.isProd, gulp.dest(config.buildDir)))
  .pipe(gulpif(!global.isProd, browserSync.stream()));

});