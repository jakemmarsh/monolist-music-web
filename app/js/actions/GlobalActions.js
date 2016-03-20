'use strict';

import Reflux from 'reflux';

const GlobalActions = Reflux.createActions([

  'loadUserEditablePlaylists',
  'loadUserGroups',
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
