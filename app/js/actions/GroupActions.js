'use strict';

import Reflux from 'reflux';

var PlaylistActions = Reflux.createActions([

  'open',
  'loadPlaylists',
  'search',
  'update',
  'addMember',
  'removeMember',
  'follow',
  'delete'

]);

export default PlaylistActions;