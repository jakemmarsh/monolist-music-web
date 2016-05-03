'use strict';

import Reflux from 'reflux';

const GlobalActions = Reflux.createActions([

  'loadHomePage',
  'loadUserEditablePlaylists',
  'loadUserGroups',
  'loadUserNotifications',
  'markNotificationsAsRead',
  'loadUserLikes',
  'loadExplorePosts',
  'loadExploreSearches',
  'loadExploreRecentlyPlayed',
  'loadChartsPage',
  'loadGroups',
  'triggerSuccessIndicator',
  'triggerFailureIndicator',
  'openModal',
  'closeModal',
  'openContextMenu',
  'closeContextMenu'

]);

export default GlobalActions;
