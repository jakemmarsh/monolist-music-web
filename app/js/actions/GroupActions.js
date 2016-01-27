'use strict';

import Reflux from 'reflux';

var PlaylistActions = Reflux.createActions([

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