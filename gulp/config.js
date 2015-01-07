'use strict';

module.exports = {

  'nwVersion': '0.11.5',

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
    'src': './dist/codecs/',
    'dest': './webkitbuilds/'
  },

  'sourceDir': './app/',
  'buildDir': './build/',
  'webkitBuildDir': './webkitbuilds/',

  'test': {
    'karma': './test/karma.conf.js'
  }

};