'use strict';

import gulp        from 'gulp';
import runSequence from 'run-sequence';

gulp.task('dev', ['clean'], (cb) => {

  global.isProd = false;

  runSequence(['sass', 'imagemin', 'browserify', 'copyFonts', 'copyIndex'], 'watch', cb);

});
