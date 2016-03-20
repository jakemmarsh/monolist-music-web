'use strict';

import gulp from 'gulp';

gulp.task('preDeploy', ['switchAPI', 'deployAssets'], (cb) => { cb(); });
