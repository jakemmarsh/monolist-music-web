'use strict';

import Reflux       from 'reflux';
import _            from 'lodash';

import TrackActions from '../actions/TrackActions';
import Mixpanel     from '../utils/Mixpanel';
import TrackAPI     from '../utils/TrackAPI';

const CurrentTrackStore = Reflux.createStore({

  init() {
    this.track = null;
    this.currentIndex = null;

    this.listenTo(TrackActions.select, this.selectTrack);
    this.listenTo(TrackActions.upvote, this.upvoteTrack);
    this.listenTo(TrackActions.downvote, this.downvoteTrack);
  },

  selectTrack(track, index) {
    this.track = track;
    this.currentIndex = index;

    Mixpanel.logEvent('play track', {
      track: track
    });

    this.trigger(this.track, this.currentIndex);
  },

  upvoteTrack(track, currentUser) {
    TrackAPI.upvote(track.id).then(() => {
      Mixpanel.logEvent('upvote track', {
        track: track
      });

      const upvoteIndex = _.findIndex(this.track.upvotes, (upvote) => {
        return upvote.userId === currentUser.id;
      });
      const downvoteIndex = _.findIndex(this.track.downvotes, (downvote) => {
        return downvote.userId === currentUser.id;
      });

      if ( upvoteIndex === -1 ) {
        this.track.upvotes.push({
          userId: currentUser.id,
          trackId: track.id
        });
      } else {
        this.track.upvotes.splice(upvoteIndex, 1);
      }

      if ( downvoteIndex !== -1 ) {
        this.track.downvotes.splice(downvoteIndex, 1);
      }

      this.trigger(this.track, this.currentIndex);
    });
  },

  downvoteTrack(track, currentUser) {
    TrackAPI.downvote(track.id).then(() => {
      Mixpanel.logEvent('downvote track', {
        track: track
      });

      const downvoteIndex = _.findIndex(this.track.downvotes, (downvote) => {
        return downvote.userId === currentUser.id;
      });
      const upvoteIndex = _.findIndex(this.track.upvotes, (upvote) => {
        return upvote.userId === currentUser.id;
      });

      if ( downvoteIndex === -1 ) {
        this.track.downvotes.push({
          userId: currentUser.id,
          trackId: track.id
        });
      } else {
        this.track.downvotes.splice(downvoteIndex, 1);
      }

      if ( upvoteIndex !== -1 ) {
        this.track.upvotes.splice(upvoteIndex, 1);
      }

      this.trigger(this.track, this.currentIndex);
    });
  }

});

export default CurrentTrackStore;
