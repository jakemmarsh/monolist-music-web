'use strict';

import Reflux               from 'reflux';

import GlobalActions        from '../actions/GlobalActions';
import PlaylistActions      from '../actions/PlaylistActions';
import CurrentUserStore     from './CurrentUserStore';
import CurrentPlaylistStore from './CurrentPlaylistStore';
import UserAPI              from '../utils/UserAPI';
import PlaylistAPI          from '../utils/PlaylistAPI';

var UserEditablePlaylistsStore = Reflux.createStore({

  init() {
    this.playlists = null;

    this.listenTo(GlobalActions.loadUserEditablePlaylists, this.loadCurrentUserEditablePlaylists);
    this.listenTo(PlaylistActions.create, this.createPlaylist);
    this.listenTo(PlaylistActions.addTrack, this.addTrackToPlaylist);
  },

  loadCurrentUserEditablePlaylists(cb = function() {}) {
    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      console.log('load collaborations for:', CurrentUserStore.user.id);

      UserAPI.getEditablePlaylists(CurrentUserStore.user.id).then(playlists => {
        this.playlists = playlists;
        this.trigger(this.playlists);
        cb(playlists);
      });
    }
  },

  createPlaylist(playlist, cb = function() {}) {
    console.log('create playlist:', playlist);

    PlaylistAPI.create(playlist).then(createdPlaylist => {
      cb(null, createdPlaylist);
      GlobalActions.loadUserEditablePlaylists();
    }).catch(err => {
      cb(err);
    });
  },

  addTrackToPlaylist(playlist, track, cb = function() {}) {
    console.log('add track to playlist:', playlist);

    PlaylistAPI.addTrack(playlist.id, track).then(modifiedPlaylist => {
      cb(modifiedPlaylist);

      // Update play queue if changing current playlist
      if ( CurrentPlaylistStore.playlist && CurrentPlaylistStore.playlist.id === modifiedPlaylist.id ) {
        PlaylistActions.play(modifiedPlaylist);
      }
    });
  }

});

export default UserEditablePlaylistsStore;