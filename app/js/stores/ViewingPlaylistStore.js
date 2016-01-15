'use strict';

import Reflux           from 'reflux';

import GlobalActions    from '../actions/GlobalActions';
import PlaylistActions  from '../actions/PlaylistActions';
import TrackActions     from '../actions/TrackActions';
import CurrentUserStore from '../stores/CurrentUserStore';
import PlaylistAPI      from '../utils/PlaylistAPI';
import TrackAPI         from '../utils/TrackAPI';
import Mixpanel         from '../utils/Mixpanel';

var ViewingPlaylistStore = Reflux.createStore({

  init() {
    this.playlist = null;

    this.listenTo(PlaylistActions.open, this.loadPlaylist);
    this.listenTo(PlaylistActions.update, this.updatePlaylist);
    this.listenTo(PlaylistActions.follow, this.followPlaylist);
    this.listenTo(PlaylistActions.like, this.togglePlaylistLike);
    this.listenTo(PlaylistActions.removeTrack, this.removeTrackFromPlaylist);
    this.listenTo(PlaylistActions.addCollaborator, this.addCollaborator);
    this.listenTo(PlaylistActions.removeCollaborator, this.removeCollaborator);
    this.listenTo(TrackActions.upvote, this.toggleTrackUpvote);
    this.listenTo(TrackActions.downvote, this.toggleTrackDownvote);
    this.listenTo(TrackActions.addComment, this.addTrackComment);
    this.listenTo(TrackActions.removeComment, this.removeTrackComment);
    this.listenTo(PlaylistActions.delete, this.deletePlaylist);
  },

  loadPlaylist(playlistSlug, cb = function() {}) {
    PlaylistAPI.get(playlistSlug).then((playlist) => {
      this.playlist = playlist;
      Mixpanel.logEvent('view playlist', {
        playlist: this.playlist
      });

      cb(null, playlist);
      this.trigger(null, this.playlist);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  },

  updatePlaylist(playlistId, updates, cb = function() {}) {
    PlaylistAPI.update(playlistId, updates).then((updatedPlaylist) => {
      this.playlist = updatedPlaylist;
      Mixpanel.logEvent('update playlist', {
        playlistId: playlistId,
        updates: updates
      });

      cb(null, this.playlist);
      this.trigger(null, this.playlist);
    }).catch((err) => {
      cb(err);
    });
  },

  followPlaylist(playlist, cb = function() {}) {
    PlaylistAPI.follow(playlist.id).then(() => {
      Mixpanel.logEvent('follow playlist', {
        playlistId: playlist.id
      });

      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  removeTrackFromPlaylist(playlist, track, cb = function() {}) {
    PlaylistAPI.removeTrack(playlist.id, track.id).then(() => {
      Mixpanel.logEvent('remove track', {
        playlistId: playlist.id,
        trackId: track.id
      });

      cb(null);
      GlobalActions.triggerSuccessIndicator();
    }).catch((err) => {
      cb(err);
    });
  },

  addCollaborator(playlist, user, cb = function() {}) {
    PlaylistAPI.addCollaborator(playlist.id, user.id).then(() => {
      Mixpanel.logEvent('add collaborator', {
        playlistId: playlist.id,
        userId: user.id
      });

      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  removeCollaborator(playlist, user, cb = function() {}) {
    PlaylistAPI.removeCollaborator(playlist.id, user.id).then(() => {
      Mixpanel.logEvent('remove collaborator', {
        playlistId: playlist.id,
        userId: user.id
      });

      cb(null);
      // Only reload collaborations if it was the current user quitting collaboration
      if ( user.id === CurrentUserStore.user.id ) { GlobalActions.loadUserEditablePlaylists(); }
    }).catch((err) => {
      cb(err);
    });
  },

  togglePlaylistLike(cb = function() {}) {
    PlaylistAPI.like(this.playlist.id, CurrentUserStore.user.id).then(() => {
      Mixpanel.logEvent('like playlist', {
        playlistId: this.playlist.id
      });

      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  toggleTrackUpvote(track, cb = function() {}) {
    cb = cb || function () {};

    TrackAPI.upvote(track.id).then(() => {
      Mixpanel.logEvent('upvote track', {
        playlistId: this.playlist.id,
        trackId: track.id
      });

      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  toggleTrackDownvote(track, cb = function() {}) {
    cb = cb || function () {};

    TrackAPI.downvote(track.id).then(() => {
      Mixpanel.logEvent('downvote track', {
        playlistId: this.playlist.id,
        trackId: track.id
      });

      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  addTrackComment(commentBody, track, cb = function() {}) {
    TrackAPI.addComment(track.id, commentBody).then((savedComment) => {
      Mixpanel.logEvent('add track comment', {
        playlistId: this.playlist.id,
        trackId: track.id,
        comment: commentBody
      });

      cb(null, savedComment);
    }).catch((err) => {
      cb(err);
    });
  },

  removeTrackComment(trackId, commentId, cb = function() {}) {
    TrackAPI.removeComment(trackId, commentId).then(() => {
      Mixpanel.logEvent('remove track comment', {
        playlistId: this.playlist.id,
        trackId: trackId,
        commentId: commentId
      });

      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  deletePlaylist(playlist, cb = function() {}) {
    PlaylistAPI.delete(playlist.id).then(() => {
      this.playlist = null;
      Mixpanel.logEvent('delete playlist', {
        playlistId: playlist.id
      });

      cb(null, this.playlist);
      this.trigger(null, this.playlist);
      GlobalActions.loadUserEditablePlaylists();
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  }

});

export default ViewingPlaylistStore;