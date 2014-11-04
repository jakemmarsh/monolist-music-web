'use strict';

var Reflux = require('reflux');

var PlaylistActions = Reflux.createActions([

  'open',
  'play',
  'delete'

]);

module.exports = PlaylistActions;