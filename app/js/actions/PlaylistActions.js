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
  'reorderTracks',
  'addCollaborator',
  'removeCollaborator',
  'delete'

]);

export default PlaylistActions;
