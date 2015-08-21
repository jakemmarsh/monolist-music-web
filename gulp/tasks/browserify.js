'use strict';

import gulp         from 'gulp';
import gulpif       from 'gulp-if';
import gutil        from 'gulp-util';
import source       from 'vinyl-source-stream';
import streamify    from 'gulp-streamify';
import rename       from 'gulp-rename';
import watchify     from 'watchify';
import browserify   from 'browserify';
import babelify     from 'babelify';
import uglify       from 'gulp-uglify';
import handleErrors from '../util/handle-errors';
import config       from '../config';

// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(file, watch) {

  let bundler = browserify({
    entries: [config.sourceDir + 'js/' + file],
    debug: !global.isProd,
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  if ( watch ) {
    bundler = watchify(bundler);
    bundler.on('update', () => {
      rebundle();
      gutil.log('Rebundle...');
    });
  }

  bundler.transform(babelify);

  function rebundle() {
    let stream = bundler.bundle();
    return stream.on('error', handleErrors)
    .pipe(source(file))
    .pipe(gulpif(global.isProd, streamify(uglify({
      compress: { drop_console: true } // remove console.logs when building for prod
    }))))
    .pipe(streamify(rename({
      basename: 'main',
      suffix: '.min'
    })))
    .pipe(gulp.dest(config.scripts.dest));
  }

  return rebundle();

}

gulp.task('browserify', () => {

  // Only run watchify if NOT production
  return buildScript('index.js', !global.isProd);

});