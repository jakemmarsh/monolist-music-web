'use strict';

import Reflux from 'reflux';

var PlaylistActions = Reflux.createActions([

  'open',
  'loadPosts',
  'loadPlaylists',
  'search',
  'update',
  'addMember',
  'removeMember',
  'follow',
  'delete'

]);

export default PlaylistActions;