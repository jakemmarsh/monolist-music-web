'use strict';

/**
 * @ngInject
 */
function Routes($stateProvider, $locationProvider, $urlRouterProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'landing.html'
  })
  .state('login', {
    url: '/login',
    controller: 'LoginCtrl as login',
    templateUrl: 'login.html',
    title: 'Login'
  })
  .state('inner', {
    templateUrl: 'inner.html'
  });

  $urlRouterProvider.otherwise('/');

}

module.exports = Routes;