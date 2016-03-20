'use strict';

import Reflux from 'reflux';

const PlaylistActions = Reflux.createActions([

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
