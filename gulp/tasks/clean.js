'use strict';

var config = require('../config');
var gulp   = require('gulp');
var del    = require('del');

gulp.task('clean', function(cb) {

  del([config.buildDir + '/**/*', config.webkitBuildDir + '/**/*', '!' + config.buildDir + '/package.json'], cb);

});