'use strict';

import Reflux from 'reflux';

const PlaylistActions = Reflux.createActions([

  'create',
  'open',
  'loadPosts',
  'loadPlaylists',
  'update',
  'addMember',
  'removeMember',
  'follow',
  'delete'

]);

export default PlaylistActions;
