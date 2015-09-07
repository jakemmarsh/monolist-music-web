'use strict';

import config from '../config';
import gulp   from 'gulp';
import del    from 'del';

gulp.task('clean', (cb) => {

  del([
    config.buildDir + '/**/*',
    './*.zip'
  ], cb);

});