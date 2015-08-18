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

  'sourceDir': './app/',
  'buildDir': './build/',

  'tests': './__tests__/**/*.{js,jsx}',

  'api': {
    'dev': 'http://dev.api.monolist.co/v1/',
    'prod': 'https://api.monolist.co/v1/'
  }

};