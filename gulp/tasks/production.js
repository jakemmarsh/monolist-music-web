'use strict';

import gulp        from 'gulp';
import runSequence from 'run-sequence';

gulp.task('prod', ['clean'], (cb) => {

  cb = cb || function() {};

  runSequence(
    ['sass', 'imagemin', 'browserify', 'copyFonts', 'copyIndex'],
    'cacheBust',
    'cdnizer',
    'updateEnv',
    'switchFb',
    cb
  );

});
