'use strict';

var Reflux = require('reflux');

var PlaylistActions = Reflux.createActions([

  'create',
  'open',
  'play',
  'delete'

]);

module.exports = PlaylistActions;