'use strict';

import gulp        from 'gulp';
import runSequence from 'run-sequence';
import shell       from 'gulp-shell';

gulp.task('dev', ['clean'], () => {

  let startServer = function() {
    return gulp.src('')
      .pipe(shell('supervisor server.js'));
  };

  global.isProd = false;

  runSequence(['sass', 'imagemin', 'browserify', 'copyFonts', 'copyIndex'], 'watch', startServer);

});