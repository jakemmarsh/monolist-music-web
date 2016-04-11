'use strict';

import Reflux      from 'reflux';
import _           from 'lodash';

import UserActions from '../actions/UserActions';
import UserAPI     from '../utils/UserAPI';
import Mixpanel    from '../utils/Mixpanel';

const ViewingProfileStore = Reflux.createStore({

  init() {
    this.profile = null;

    this.listenTo(UserActions.openProfile, this.loadUserProfile);
    this.listenTo(UserActions.follow, this.followUser);
  },

  loadUserProfile(username, cb = function() {}) {
    UserAPI.get(username).then((profile) => {
      this.profile = profile;
      Mixpanel.logEvent('view profile', {
        profile: this.profile
      });

      this.trigger(null, this.profile);
      cb(null, this.profile);

      UserAPI.getPlaylists(this.profile.id).then(playlists => {
        this.profile.playlists = playlists;
        this.trigger(null, this.profile);
      });

      UserAPI.getCollaborations(this.profile.id).then(collaborations => {
        this.profile.collaborations = collaborations;
        this.trigger(null, this.profile);
      });

      UserAPI.getLikes(this.profile.id).then(likes => {
        this.profile.likes = likes;
        this.trigger(null, this.profile);
      });

      UserAPI.getStars(this.profile.id).then(stars => {
        this.profile.starredTracks = stars;
        this.trigger(null, this.profile);
      });
    });
  },

  followUser(profile, currentUser, cb = function() {}) {
    UserAPI.follow(profile.id).then(() => {
      Mixpanel.logEvent('follow user', {
        userId: profile.id
      });

      const followerIndex = _.findIndex(this.profile.followers, (follow) => {
        return follow.followerId === currentUser.id;
      });

      if ( followerIndex === -1 ) {
        this.profile.followers.push({
          userId: profile.id,
          followerId: currentUser.id
        });
      } else {
        this.profile.followers.splice(followerIndex, 1);
      }

      cb(null, this.profile);
      this.trigger(null, this.profile);
    }).catch(err => {
      cb(err);
    });
  }

});

export default ViewingProfileStore;
