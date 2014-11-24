'use strict';

var Reflux           = require('reflux');

var PlaylistActions  = require('../actions/PlaylistActions');
var TrackActions     = require('../actions/TrackActions');
var CurrentUserStore = require('../stores/CurrentUserStore');
var PlaylistAPI      = require('../utils/PlaylistAPI');
var TrackAPI         = require('../utils/TrackAPI');

var ViewingPlaylistStore = Reflux.createStore({

  init: function() {
    this.playlist = null;

    this.listenTo(PlaylistActions.open, this.loadPlaylist);
    this.listenTo(PlaylistActions.like, this.togglePlaylistLike);
    this.listenTo(PlaylistActions.removeTrack, this.removeTrackFromPlaylist);
    this.listenTo(TrackActions.upvote, this.toggleTrackUpvote);
    this.listenTo(TrackActions.downvote, this.toggleTrackDownvote);
    this.listenTo(TrackActions.addComment, this.addTrackComment);
    this.listenTo(TrackActions.removeComment, this.removeTrackComment);
    this.listenTo(PlaylistActions.delete, this.deleteIfViewing);
  },

  loadPlaylist: function(playlistSlug, cb) {
    cb = cb || function() {};

    console.log('load playlist');

    PlaylistAPI.get(playlistSlug).then(function(playlist) {
      console.log('loaded:', playlist);
      this.playlist = playlist;
      this.trigger(playlist);
      cb(playlist);
    }.bind(this));
  },

  removeTrackFromPlaylist: function(playlist, track, cb) {
    cb = cb || function() {};

    console.log('remove track from playlist');

    PlaylistAPI.removeTrack(playlist.id, track.id).then(function() {
      this.loadPlaylist(playlist.id, cb);
    }.bind(this));
  },

  togglePlaylistLike: function(playlistId, cb) {
    cb = cb || function() {};

    console.log('toggle like playlist:', playlistId);

    PlaylistAPI.like(this.playlist.id, CurrentUserStore.user.id).then(function() {
      PlaylistActions.open(this.playlist.id);
      cb();
    }.bind(this));
  },

  toggleTrackUpvote: function(track, cb) {
    // TODO: move object-building into API
    var upvote = {
      TrackId: track.id,
      UserId: CurrentUserStore.user.id
    };

    cb = cb || function () {};

    console.log('upvote track:', track.id);

    TrackAPI.upvote(track.id, upvote).then(function() {
      PlaylistActions.open(this.playlist.id);
      cb();
    }.bind(this));
  },

  toggleTrackDownvote: function(track, cb) {
    // TODO: move object-building into API
    var downvote = {
      TrackId: track.id,
      UserId: CurrentUserStore.user.id
    };

    cb = cb || function () {};

    console.log('downvote track:', track.id);

    TrackAPI.downvote(track.id, downvote).then(function() {
      PlaylistActions.open(this.playlist.id);
      cb();
    }.bind(this));
  },

  addTrackComment: function(commentBody, track, cb) {
    var comment = {
      body: commentBody,
      TrackId: track.id,
      UserId: CurrentUserStore.user.id
    };

    cb = cb || function() {};

    console.log('add comment to track:', track.id);

    TrackAPI.addComment(track.id, comment).then(function() {
      cb();
      this.loadPlaylist(this.playlist.id);
    }.bind(this));
  },

  removeTrackComment: function(trackId, commentId, cb) {
    cb = cb || function() {};

    console.log('remove comment:', commentId, 'from track:', trackId);

    TrackAPI.removeComment(trackId, commentId).then(function() {
      cb();
      this.loadPlaylist(this.playlist.id);
    }.bind(this));
  },

  deleteIfViewing: function(playlistId) {
    if ( playlistId === this.playlist.id ) {
      console.log('delete if viewing');
      this.playlist = null;
      this.trigger(null);
    }
  }

});

module.exports = ViewingPlaylistStore;