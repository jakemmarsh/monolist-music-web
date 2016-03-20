'use strict';

import gulp   from 'gulp';
import config from '../config';

gulp.task('watch', ['server', 'browserSync'], () => {
  // Scripts are automatically watched by Watchify inside Browserify task
  gulp.watch(config.styles.src,               ['sass']);
  gulp.watch(config.images.src,               ['imagemin']);
  gulp.watch(config.fonts.src,                ['copyFonts']);
  gulp.watch(config.sourceDir + 'index.html', ['copyIndex']);
});
