'use strict';

var Reflux = require('reflux');

var UserActions = Reflux.createActions([

  'check',
  'login',
  'update',
  'logout'

]);

module.exports = UserActions;