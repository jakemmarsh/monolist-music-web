'use strict';

import Reflux           from 'reflux';
import _                from 'lodash';

import GlobalActions    from '../actions/GlobalActions';
import PlaylistActions  from '../actions/PlaylistActions';
import PlaybackActions  from '../actions/PlaybackActions';
import TrackActions     from '../actions/TrackActions';
import CurrentUserStore from '../stores/CurrentUserStore';
import PlaylistAPI      from '../utils/PlaylistAPI';
import TrackAPI         from '../utils/TrackAPI';
import Mixpanel         from '../utils/Mixpanel';

const ViewingPlaylistStore = Reflux.createStore({

  init() {
    this.playlist = null;

    this.listenTo(PlaylistActions.open, this.loadPlaylist);
    this.listenTo(PlaylistActions.update, this.updatePlaylist);
    this.listenTo(PlaylistActions.follow, this.followPlaylist);
    this.listenTo(PlaylistActions.like, this.togglePlaylistLike);
    this.listenTo(PlaylistActions.removeTrack, this.removeTrackFromPlaylist);
    this.listenTo(PlaylistActions.reorderTracks, this.reorderTracks);
    this.listenTo(PlaylistActions.addCollaborator, this.addCollaborator);
    this.listenTo(PlaylistActions.removeCollaborator, this.removeCollaborator);
    this.listenTo(PlaybackActions.sortPlaylist, this.sortPlaylist);
    // this.listenTo(TrackActions.upvote, this.toggleTrackUpvote);
    // this.listenTo(TrackActions.downvote, this.toggleTrackDownvote);
    this.listenTo(TrackActions.addComment, this.addTrackComment);
    this.listenTo(TrackActions.removeComment, this.removeTrackComment);
    this.listenTo(PlaylistActions.identifyTracks, this.identifyTracks);
  },

  loadPlaylist(playlistSlug, cb = function() {}) {
    PlaylistAPI.get(playlistSlug).then((playlist) => {
      this.playlist = playlist;
      Mixpanel.logEvent('view playlist', {
        playlist: this.playlist
      });

      cb(null, this.playlist);
      this.trigger(null, this.playlist);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  },

  sortPlaylist(attr, asc = true) {
    const conditionalReverse = function(arr) {
      return asc ? arr : arr.reverse();
    };

    _.mixin({
      conditionalReverse: conditionalReverse
    });

    if ( this.playlist ) {
      const playlistCopy = Object.assign({}, this.playlist);

      playlistCopy.tracks = _.chain(playlistCopy.tracks)
        .sortBy(attr)
        .conditionalReverse()
        .partition((track) => { return track[attr] !== undefined; })
        .flatten()
        .value();

      this.playlist = playlistCopy;

      this.trigger(null, this.playlist);
    }
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

  followPlaylist(cb = function() {}) {
    PlaylistAPI.follow(this.playlist.id).then(() => {
      const currentUser = CurrentUserStore.user;

      Mixpanel.logEvent('follow playlist', {
        playlistId: this.playlist.id
      });

      const followerIndex = _.findIndex(this.playlist.followers, (follow) => {
        return follow.userId === currentUser.id;
      });

      if ( followerIndex === -1 ) {
        this.playlist.followers.push({
          userId: currentUser.id,
          playlistId: this.playlist.id
        });
      } else {
        this.playlist.followers.splice(followerIndex, 1);
      }

      cb(null, this.playlist);
      this.trigger(this.playlist);
    }).catch((err) => {
      cb(err);
    });
  },

  removeTrackFromPlaylist(playlist, track) {
    if ( this.playlist && playlist.id === this.playlist.id ) {
      PlaylistAPI.removeTrack(playlist.id, track.id).then(() => {
        Mixpanel.logEvent('remove track', {
          playlistId: playlist.id,
          trackId: track.id
        });

        this.playlist.tracks = _.reject(this.playlist.tracks, (playlistTrack) => {
          return playlistTrack.id === track.id;
        });

        GlobalActions.triggerSuccessIndicator();
        this.trigger(null, this.playlist);
      });
    }
  },

  reorderTracks(playlist, updates, cb = function() {}) {
    PlaylistAPI.reorderTracks(playlist.id, updates).then((updatedTracks) => {
      Mixpanel.logEvent('reorder tracks', {
        playlistId: playlist.id,
        updates: updates
      });

      this.playlist.tracks = updatedTracks;

      GlobalActions.triggerSuccessIndicator();
      cb(null, this.playlist);
      this.trigger(null, this.playlist);
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

      this.playlist.collaborators.push(user);

      cb(null, this.playlist);
      this.trigger(null, this.playlist);
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

      this.playlist.collaborators = _.reject(this.playlist.collaborators, (collaborator) => {
        return collaborator.id === user.id;
      });

      // Only reload collaborations if it was the current user quitting collaboration
      if ( user.id === CurrentUserStore.user.id ) { GlobalActions.loadUserEditablePlaylists(); }

      cb(null, this.playlist);
      this.trigger(this.playlist);
    }).catch((err) => {
      cb(err);
    });
  },

  togglePlaylistLike(cb = function() {}) {
    const currentUser = CurrentUserStore.user;

    PlaylistAPI.like(this.playlist.id, currentUser.id).then(() => {
      Mixpanel.logEvent('like playlist', {
        playlistId: this.playlist.id
      });

      const likeIndex = _.findIndex(this.playlist.likes, (like) => {
        return like.userId === currentUser.id;
      });

      if ( likeIndex === -1 ) {
        this.playlist.likes.push({
          userId: currentUser.id,
          playlistId: this.playlist.id
        });
      } else {
        this.playlist.likes.splice(likeIndex, 1);
      }

      cb(null, this.playlist);
      this.trigger(null, this.playlist);
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

      const trackIndex = _.findIndex(this.playlist.tracks, (playlistTrack) => {
        return track.id === playlistTrack.id;
      });

      this.playlist.tracks[trackIndex].comments.push(savedComment);

      cb(null, this.playlist);
      this.trigger(null, this.playlist);
;    }).catch((err) => {
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

      const trackIndex = _.findIndex(this.playlist.tracks, (playlistTrack) => {
        return trackId === playlistTrack.id;
      });

      const commentIndex = _.findIndex(this.playlist.tracks[trackIndex].comments, (comment) => {
        return commentId === comment.id;
      });

      if ( commentIndex !== -1 ) {
        this.playlist.tracks[trackIndex].comments.splice(commentIndex, 1);
      }

      cb(null, this.playlist);
      this.trigger(null, this.playlist);
    }).catch((err) => {
      cb(err);
    });
  },

  identifyTracks(playlistId, cb = function() {}) {
    PlaylistAPI.identifyTracks(playlistId).then(() => {
      cb(null);
    }).catch((err) => {
      cb(err);
    });
  }

});

export default ViewingPlaylistStore;
