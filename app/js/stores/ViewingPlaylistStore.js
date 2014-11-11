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
    this.listenTo(PlaylistActions.removeTrack, this.removeTrackFromPlaylist);
    this.listenTo(TrackActions.upvote, this.toggleTrackUpvote);
    this.listenTo(TrackActions.downvote, this.toggleTrackDownvote);
    this.listenTo(TrackActions.addComment, this.addTrackComment);
    this.listenTo(PlaylistActions.delete, this.deleteIfViewing);
  },

  loadPlaylist: function(playlistId, cb) {
    cb = cb || function() {};

    console.log('load playlist');

    PlaylistAPI.get(playlistId).then(function(playlist) {
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

  toggleTrackUpvote: function(track, cb) {
    var upvote = {
      track_id: track.id,
      user_id: CurrentUserStore.user.id
    };

    cb = cb || function () {};

    console.log('upvote track:', track.id);

    TrackAPI.upvote(track.id, upvote).then(function() {
      PlaylistActions.open(this.playlist.id);
      cb();
    }.bind(this));
  },

  toggleTrackDownvote: function(track, cb) {
    var downvote = {
      track_id: track.id,
      user_id: CurrentUserStore.user.id
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
      track_id: track.id,
      creator_id: CurrentUserStore.user.id
    };

    cb = cb || function() {};

    console.log('add comment to track:', track.id);

    TrackAPI.addComment(track.id, comment).then(function() {
      cb();
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