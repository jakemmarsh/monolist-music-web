'use strict';

import Reflux from 'reflux';

var PlaylistActions = Reflux.createActions([

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