'use strict';

module.exports = function(config) {

  config.set({

    basePath: '../',
    frameworks: ['jasmine', 'browserify'],
    preprocessors: {
      'app/js/**/*.js': ['browserify'],
      'test/unit/**/*.js': ['browserify']
    },
    browsers: ['Chrome'],
    reporters: ['progress'],

    browserify: {
      debug: true,
      transform: ['reactify']
    },

    autoWatch: true,

    plugins: [
      'karma-jasmine',
      'karma-bro',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ],

    proxies: {
      '/': 'http://localhost:9876/'
    },

    urlRoot: '/__karma__/',

    files: [
      // app-specific code
      'app/js/index.js',

      // test files
      'test/unit/**/*.js'
    ]

  });

};