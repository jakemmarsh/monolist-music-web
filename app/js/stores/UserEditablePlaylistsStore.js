'use strict';

import Reflux               from 'reflux';
import _                    from 'lodash';

import GlobalActions        from '../actions/GlobalActions';
import PlaylistActions      from '../actions/PlaylistActions';
import CurrentUserStore     from './CurrentUserStore';
import CurrentPlaylistStore from './CurrentPlaylistStore';
import UserAPI              from '../utils/UserAPI';
import PlaylistAPI          from '../utils/PlaylistAPI';
import Mixpanel             from '../utils/Mixpanel';

const UserEditablePlaylistsStore = Reflux.createStore({

  init() {
    this.playlists = null;

    this.listenTo(GlobalActions.loadUserEditablePlaylists, this.loadCurrentUserEditablePlaylists);
    this.listenTo(PlaylistActions.create, this.createPlaylist);
    this.listenTo(PlaylistActions.update, this.updatePlaylist);
    this.listenTo(PlaylistActions.addTrack, this.addTrackToPlaylist);
    this.listenTo(PlaylistActions.delete, this.deletePlaylist);
  },

  loadCurrentUserEditablePlaylists(cb = function() {}) {
    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      UserAPI.getEditablePlaylists(CurrentUserStore.user.id).then((playlists) => {
        this.playlists = playlists;
        cb(null, this.playlists);
        this.trigger(null, this.playlists);
      });
    }
  },

  createPlaylist(playlist, cb = function() {}) {
    PlaylistAPI.create(playlist).then((createdPlaylist) => {
      Mixpanel.logEvent('create playlist', {
        playlist: createdPlaylist
      });
      cb(null, createdPlaylist);
      GlobalActions.loadUserEditablePlaylists();
    }).catch((err) => {
      cb(err);
    });
  },

  updatePlaylist(playlistId, updates) {
    const playlistsCopy = this.playlists.slice();
    const playlistIndex = _.indexOf(playlistsCopy, _.find(playlistsCopy, { id: playlistId }));

    playlistsCopy[playlistIndex] = _.assign(playlistsCopy[playlistIndex], updates);
    this.playlists = playlistsCopy;

    this.trigger(null, this.playlists);
  },

  addTrackToPlaylist(playlist, track, cb = function() {}) {
    PlaylistAPI.addTrack(playlist.id, track).then((modifiedPlaylist) => {
      // Update play queue if changing current playlist
      if ( CurrentPlaylistStore.playlist && CurrentPlaylistStore.playlist.id === modifiedPlaylist.id ) {
        PlaylistActions.play(modifiedPlaylist);
      }

      GlobalActions.triggerSuccessIndicator();
      Mixpanel.logEvent('add track', {
        playlistId: modifiedPlaylist.id,
        track: track
      });

      cb(modifiedPlaylist);
    });
  },

  deletePlaylist(playlist, cb = function() {}) {
    PlaylistAPI.delete(playlist.id).then(() => {
      this.playlists = _.reject(this.playlists, (currPlaylist) => {
        return currPlaylist.id === playlist.id;
      });

      GlobalActions.triggerSuccessIndicator();
      Mixpanel.logEvent('delete playlist', {
        playlistId: playlist.id
      });

      cb(null, this.playlists);
      this.trigger(null, this.playlists);
    });
  }

});

export default UserEditablePlaylistsStore;
