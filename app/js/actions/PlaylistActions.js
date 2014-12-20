'use strict';

var Reflux = require('reflux');

var PlaylistActions = Reflux.createActions([

  'create',
  'open',
  'play',
  'follow',
  'like',
  'addTrack',
  'removeTrack',
  'addCollaborator',
  'removeCollaborator',
  'delete'

]);

module.exports = PlaylistActions;