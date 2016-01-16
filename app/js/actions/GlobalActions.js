'use strict';

import Reflux from 'reflux';

var GlobalActions = Reflux.createActions([

  'loadUserEditablePlaylists',
  'loadUserNotifications',
  'markNotificationsAsRead',
  'loadUserLikes',
  'loadExplorePosts',
  'loadExploreSearches',
  'loadPlaylistsPage',
  'loadGroups',
  'triggerSuccessIndicator',
  'triggerFailureIndicator',
  'openModal',
  'closeModal'

]);

export default GlobalActions;