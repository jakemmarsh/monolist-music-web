'use strict';

var Reflux = require('reflux');

var GlobalActions = Reflux.createActions([

  'loadUserCollaborations',
  'loadUserLikes',

  'openUserProfile'

]);

module.exports = GlobalActions;