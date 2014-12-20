'use strict';

var Reflux = require('reflux');

var UserActions = Reflux.createActions([

  'check',
  'login',
  'update',
  'follow',
  'logout'

]);

module.exports = UserActions;