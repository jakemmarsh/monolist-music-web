'use strict';

export default [
  {
    text: 'Explore',
    icon: 'icon-compass',
    page: 'Explore',
    requiresUser: false
  },
  {
    text: 'My Playlists',
    icon: 'icon-list',
    page: 'Playlists',
    requiresUser: true
  },
  {
    text: 'Create Playlist',
    icon: 'icon-plus',
    page: 'CreatePlaylist',
    requiresUser: true
  },
  {
    text: 'Groups',
    icon: 'icon-group',
    page: 'Groups',
    requiresUser: false
  },
  {
    text: 'Create Group',
    icon: 'icon-user-plus',
    page: 'CreateGroup',
    requiresUser: true
  },
  {
    text: 'Search Tracks',
    icon: 'icon-search',
    page: 'TrackSearch',
    requiresUser: false
  }
];