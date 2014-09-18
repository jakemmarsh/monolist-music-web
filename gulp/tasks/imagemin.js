'use strict';

var gulp     = require('gulp');
var gulpif   = require('gulp-if');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var config   = require('../config');

gulp.task('imagemin', function() {

  // Run imagemin task on all images
  return gulp.src(config.images.src)
    .pipe(gulpif(global.isProd, imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
    })))
    .pipe(gulp.dest(config.images.dest));

});