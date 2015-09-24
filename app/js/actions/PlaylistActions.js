'use strict';

import Reflux from 'reflux';

var PlaylistActions = Reflux.createActions([

  'create',
  'update',
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

export default PlaylistActions;