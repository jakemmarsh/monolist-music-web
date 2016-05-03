'use strict';

import Reflux from 'reflux';

const UserActions = Reflux.createActions([

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
