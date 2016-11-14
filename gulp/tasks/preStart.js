'use strict';

import gulp from 'gulp';

gulp.task('preStart', ['switchAPI', 'deployAssets'], (cb) => { cb(); });
