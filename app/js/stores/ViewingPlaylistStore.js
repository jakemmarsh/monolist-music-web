'use strict';

var Reflux           = require('reflux');

var GlobalActions    = require('../actions/GlobalActions');
var PlaylistActions  = require('../actions/PlaylistActions');
var TrackActions     = require('../actions/TrackActions');
var CurrentUserStore = require('../stores/CurrentUserStore');
var PlaylistAPI      = require('../utils/PlaylistAPI');
var TrackAPI         = require('../utils/TrackAPI');

var ViewingPlaylistStore = Reflux.createStore({

  init: function() {
    this.playlist = null;

    this.listenTo(PlaylistActions.open, this.loadPlaylist);
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

  loadPlaylist: function(playlistSlug, cb) {
    cb = cb || function() {};

    PlaylistAPI.get(playlistSlug).then(function(playlist) {
      console.log('loaded playlist:', playlist);
      this.playlist = playlist;
      this.trigger(playlist);
      cb(playlist);
    }.bind(this));
  },

  followPlaylist: function(playlist, cb) {
    cb = cb || function() {};

    console.log('follow playlist:', playlist);

    PlaylistAPI.follow(playlist.id).then(function() {
      cb(null);
    });
  },

  removeTrackFromPlaylist: function(playlist, track, cb) {
    cb = cb || function() {};

    console.log('remove track from playlist');

    PlaylistAPI.removeTrack(playlist.id, track.id).then(function() {
      cb(null);
    }.bind(this));
  },

  addCollaborator: function(playlist, user, cb) {
    cb = cb || function() {};

    console.log('add collaborator to playlist');

    PlaylistAPI.addCollaborator(playlist.id, user.id).then(function() {
      cb(null);
    }.bind(this));
  },

  removeCollaborator: function(playlist, user, cb) {
    cb = cb || function() {};

    console.log('remove collaborator from playlist');

    PlaylistAPI.removeCollaborator(playlist.id, user.id).then(function() {
      cb(null);
      // Only reload collaborations if it was the current user quitting collaboration
      if ( user.id === CurrentUserStore.user.id ) { GlobalActions.loadUserEditablePlaylists(); }
    }.bind(this));
  },

  togglePlaylistLike: function(playlistId, cb) {
    cb = cb || function() {};

    console.log('toggle like playlist:', playlistId);

    PlaylistAPI.like(this.playlist.id, CurrentUserStore.user.id).then(function() {
      cb();
    }.bind(this));
  },

  toggleTrackUpvote: function(track, cb) {
    cb = cb || function () {};

    console.log('upvote track:', track.id);

    TrackAPI.upvote(track.id).then(function() {
      cb();
    }.bind(this));
  },

  toggleTrackDownvote: function(track, cb) {
    cb = cb || function () {};

    console.log('downvote track:', track.id);

    TrackAPI.downvote(track.id).then(function() {
      cb();
    }.bind(this));
  },

  addTrackComment: function(commentBody, track, cb) {
    cb = cb || function() {};

    console.log('add comment to track:', track.id);

    TrackAPI.addComment(track.id, commentBody).then(function(savedComment) {
      cb(savedComment);
    }.bind(this));
  },

  removeTrackComment: function(trackId, commentId, cb) {
    cb = cb || function() {};

    console.log('remove comment:', commentId, 'from track:', trackId);

    TrackAPI.removeComment(trackId, commentId).then(function() {
      cb();
    }.bind(this));
  },

  deletePlaylist: function(playlist, cb) {
    cb = cb || function() {};

    console.log('delete from collaborations');

    PlaylistAPI.delete(playlist.id).then(function() {
      this.playlist = null;
      cb(this.playlist);
      this.trigger(this.playlist);
      GlobalActions.loadUserEditablePlaylists();
    }.bind(this));
  }

});

module.exports = ViewingPlaylistStore;