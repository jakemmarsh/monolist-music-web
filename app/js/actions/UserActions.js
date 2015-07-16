'use strict';

import Reflux from 'reflux';

var UserActions = Reflux.createActions([

  'check',
  'login',
  'facebookLogin',
  'update',
  'openProfile',
  'search',
  'follow',
  'logout'

]);

export default UserActions;