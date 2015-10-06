'use strict';

import Reflux           from 'reflux';

import GlobalActions    from '../actions/GlobalActions';
import PlaylistActions  from '../actions/PlaylistActions';
import TrackActions     from '../actions/TrackActions';
import CurrentUserStore from '../stores/CurrentUserStore';
import PlaylistAPI      from '../utils/PlaylistAPI';
import TrackAPI         from '../utils/TrackAPI';

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
      console.log('loaded playlist:', playlist);
      this.playlist = playlist;
      this.trigger(null, this.playlist);
      cb(null, playlist);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  },

  updatePlaylist(playlistId, updates, cb = function() {}) {
    console.log('upating playlist:', playlistId);

    PlaylistAPI.update(playlistId, updates).then((updatedPlaylist) => {
      this.playlist = updatedPlaylist;
      cb(null, this.playlist);
      this.trigger(null, this.playlist);
    }).catch((err) => {
      cb(err);
    });
  },

  followPlaylist(playlist, cb = function() {}) {
    console.log('follow playlist:', playlist);

    PlaylistAPI.follow(playlist.id).then(() => {
      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  removeTrackFromPlaylist(playlist, track, cb = function() {}) {
    console.log('remove track from playlist');

    PlaylistAPI.removeTrack(playlist.id, track.id).then(() => {
      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  addCollaborator(playlist, user, cb = function() {}) {
    console.log('add collaborator to playlist');

    PlaylistAPI.addCollaborator(playlist.id, user.id).then(() => {
      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  removeCollaborator(playlist, user, cb = function() {}) {
    console.log('remove collaborator from playlist');

    PlaylistAPI.removeCollaborator(playlist.id, user.id).then(() => {
      cb(null);
      // Only reload collaborations if it was the current user quitting collaboration
      if ( user.id === CurrentUserStore.user.id ) { GlobalActions.loadUserEditablePlaylists(); }
    }).catch((err) => {
      cb(err);
    });
  },

  togglePlaylistLike(cb = function() {}) {
    console.log('toggle like playlist:', this.playlist.id);

    PlaylistAPI.like(this.playlist.id, CurrentUserStore.user.id).then(() => {
      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  toggleTrackUpvote(track, cb = function() {}) {
    cb = cb || function () {};

    console.log('upvote track:', track.id);

    TrackAPI.upvote(track.id).then(() => {
      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  toggleTrackDownvote(track, cb = function() {}) {
    cb = cb || function () {};

    console.log('downvote track:', track.id);

    TrackAPI.downvote(track.id).then(() => {
      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  addTrackComment(commentBody, track, cb = function() {}) {
    console.log('add comment to track:', track.id);

    TrackAPI.addComment(track.id, commentBody).then((savedComment) => {
      cb(null, savedComment);
    }).catch((err) => {
      cb(err);
    });
  },

  removeTrackComment(trackId, commentId, cb = function() {}) {
    console.log('remove comment:', commentId, 'from track:', trackId);

    TrackAPI.removeComment(trackId, commentId).then(() => {
      cb(null);
    }).catch((err) => {
      cb(err);
    });
  },

  deletePlaylist(playlist, cb = function() {}) {
    console.log('delete from collaborations');

    PlaylistAPI.delete(playlist.id).then(() => {
      this.playlist = null;
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