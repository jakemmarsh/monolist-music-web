'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyCodecs', function() {

  // Windows codecs
  gulp.src(config.codecs.src + 'win/**/*.dll')
  .pipe(gulp.dest(config.codecs.dest + 'Monolist/win32/'));

  gulp.src(config.codecs.src + 'win/**/*.dll')
  .pipe(gulp.dest('./cache/' + config.nwVersion + '/win32/'));

  // OSX codecs
  gulp.src(config.codecs.src + 'osx/**/*.so')
  .pipe(gulp.dest(config.codecs.dest + 'Monolist/osx32/Monolist.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/'));

  return gulp.src(config.codecs.src + 'osx/**/*.so')
  .pipe(gulp.dest('./cache/' + config.nwVersion + '/osx32/node-webkit.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/'));

});