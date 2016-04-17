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

      const promises = [
        UserAPI.getPlaylists(this.profile.id),
        UserAPI.getCollaborations(this.profile.id),
        UserAPI.getGroups(this.profile.id),
        UserAPI.getLikes(this.profile.id),
        UserAPI.getStars(this.profile.id)
      ];

      Promise.all(promises).then((results) => {
        this.profile.playlists = results[0] || [];
        this.profile.collaborations = results[1] || [];
        this.profile.groups = results[2] || [];
        this.profile.likes = results[3] || [];
        this.profile.starredTracks = results[4] || [];

        cb(null, this.profile);
        this.trigger(null, this.profile);
      }).catch((err) => {
        cb(err, null);
        this.trigger(err, null);
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
