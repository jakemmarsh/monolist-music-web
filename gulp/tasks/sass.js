'use strict';

import gulp         from 'gulp';
import rename       from 'gulp-rename';
import sass         from 'gulp-sass';
import handleErrors from '../util/handle-errors';
import config       from '../config';

gulp.task('sass', () => {

  return gulp.src(config.sourceDir + 'styles/main.scss')
  .pipe(sass({
    sourceComments: global.isProd ? 'none' : 'map',
    sourceMap: 'sass',
    outputStyle: global.isProd ? 'compressed' : 'nested',
    onError: (err) => {
      // Prevent crashing on error
      console.log('SASS error:', err);
    }
  }))
  .pipe(rename({suffix: '.min'}))
  .on('error', handleErrors)
  .pipe(gulp.dest(config.styles.dest));

});