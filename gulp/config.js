'use strict';

module.exports = {

  'scripts': {
    'src': './app/js/**/*.js',
    'dest': './build/js/'
  },

  'images': {
    'src': './app/images/**/*.{jpeg,jpg,png}',
    'dest': './build/images/'
  },

  'styles': {
    'src': './app/styles/**/*.scss',
    'dest': './build/css/'
  },

  'codecs': {
    'src': './codecs/',
    'dest': './webkitbuilds/Monolist/'
  },

  'sourceDir': './app/',
  'buildDir': './build/',
  'webkitBuildDir': './webkitbuilds/',

  'test': {
    'karma': './test/karma.conf.js'
  }

};