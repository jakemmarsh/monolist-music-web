'use strict';

var Reflux = require('reflux');

var PlaylistActions = Reflux.createActions([

  'create',
  'open',
  'play',
  'addTrack',
  'removeTrack',
  'delete'

]);

module.exports = PlaylistActions;