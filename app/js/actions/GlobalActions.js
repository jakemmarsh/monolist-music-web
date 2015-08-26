'use strict';

import Reflux from 'reflux';

var GlobalActions = Reflux.createActions([

  'loadUserEditablePlaylists',
  'loadUserNotifications',
  'markNotificationsAsRead',
  'loadUserLikes',
  'loadExplorePage',
  'loadGroups'

]);

export default GlobalActions;