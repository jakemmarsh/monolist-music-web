'use strict';

export default [
  {
    text: 'Explore',
    icon: 'fa-compass',
    page: 'Explore',
    requiresUser: false
  },
  {
    text: 'My Playlists',
    icon: 'fa-list',
    page: 'Playlists',
    requiresUser: true
  },
  {
    text: 'Create Playlist',
    icon: 'fa-plus',
    page: 'CreatePlaylist',
    requiresUser: true
  },
  {
    text: 'Groups',
    icon: 'fa-users',
    page: 'Groups',
    requiresUser: false
  },
  {
    text: 'Create Group',
    icon: 'fa-user-plus',
    page: 'CreateGroup',
    requiresUser: true
  },
  {
    text: 'Search Tracks',
    icon: 'fa-search',
    page: 'TrackSearch',
    requiresUser: false
  }
];