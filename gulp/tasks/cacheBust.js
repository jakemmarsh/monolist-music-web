'use strict';

import gulp       from 'gulp';
import revReplace from 'gulp-rev-replace';
import config     from '../config';

gulp.task('cacheBust', () => {

  const manifest = gulp.src(config.buildDir + 'rev-manifest.json');

  return gulp.src(config.buildDir + 'index.html')
  .pipe(revReplace({ manifest: manifest }))
  .pipe(gulp.dest(config.buildDir));

});
