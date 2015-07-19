'use strict';

import Reflux from 'reflux';

var PlaylistActions = Reflux.createActions([

  'create',
  'open',
  'update',
  'addMember',
  'removeMember',
  'delete'

]);

export default PlaylistActions;