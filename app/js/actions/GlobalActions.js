'use strict';

import Reflux from 'reflux';

var GlobalActions = Reflux.createActions([

  'loadUserEditablePlaylists',
  'loadUserNotifications',
  'markNotificationsAsRead',
  'loadUserLikes',
  'loadExplorePosts',
  'loadExploreSearches',
  'loadExploreRecentlyPlayed',
  'loadPlaylistsPage',
  'loadGroups',
  'triggerSuccessIndicator',
  'triggerFailureIndicator',
  'openModal',
  'closeModal',
  'openContextMenu',
  'closeContextMenu'

]);

export default GlobalActions;