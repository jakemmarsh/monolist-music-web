'use strict';

var Reflux = require('reflux');

var PlaylistActions = Reflux.createActions([

  'create',
  'open',
  'play',
  'like',
  'addTrack',
  'removeTrack',
  'delete'

]);

module.exports = PlaylistActions;