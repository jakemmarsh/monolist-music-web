'use strict';

import gulp         from 'gulp';
import gulpif       from 'gulp-if';
import rev          from 'gulp-rev';
import gutil        from 'gulp-util';
import source       from 'vinyl-source-stream';
import streamify    from 'gulp-streamify';
import rename       from 'gulp-rename';
import watchify     from 'watchify';
import browserify   from 'browserify';
import uglify       from 'gulp-uglify';
import browserSync  from 'browser-sync';
import handleErrors from '../util/handle-errors';
import config       from '../config';

// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(file, watch) {

  let bundler = browserify({
    entries: [config.sourceDir + 'js/' + file],
    debug: !global.isProd,
    cache: {},
    packageCache: {},
    fullPaths: !global.isProd
  });

  if ( watch ) {
    bundler = watchify(bundler);
    bundler.on('update', () => {
      rebundle();
      gutil.log('Rebundle...');
    });
  }

  function rebundle() {
    const stream = bundler.bundle();

    return stream.on('error', handleErrors)
    .pipe(source(file))
    .pipe(gulpif(global.isProd, streamify(uglify({
      compress: { drop_console: true } // eslint-disable-line camelcase
    }))))
    .pipe(streamify(rename({ basename: 'bundle' })))
    .pipe(gulpif(global.isProd, streamify(rev())))
    .pipe(gulp.dest(config.scripts.dest))
    .pipe(gulpif(global.isProd, rev.manifest(config.buildDir + 'rev-manifest.json', {
      base: config.buildDir,
      merge: true
    })))
    .pipe(gulpif(global.isProd, gulp.dest(config.buildDir)))
    .pipe(gulpif(!global.isProd, browserSync.stream()));
  }

  return rebundle();

}

gulp.task('browserify', () => {

  // Only run watchify if NOT production
  return buildScript('index.js', !global.isProd);

});
