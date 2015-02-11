'use strict';

var gulp    = require('gulp');
var jeditor = require('gulp-json-editor');
var config  = require('../config');

gulp.task('modifyManifest', function() {

  return gulp.src(config.buildDir + 'package.json')
  .pipe(jeditor({
    'main': 'https://assets.monolist.co/app/index.html',
    'window': {
      'toolbar': false
    }
  }))
  .pipe(gulp.dest(config.buildDir));

});