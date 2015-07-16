'use strict';

import Reflux      from 'reflux';

import UserActions from '../actions/UserActions';
import UserAPI     from '../utils/UserAPI';

var ViewingProfileStore = Reflux.createStore({

  init() {
    this.profile = null;

    this.listenTo(UserActions.openProfile, this.loadUserProfile);
    this.listenTo(UserActions.follow, this.followUser);
  },

  loadUserProfile(username, cb = function() {}) {
    console.log('load user profile for:', username);

    UserAPI.get(username).then(profile => {
      this.profile = profile;
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

  followUser(user, cb = function() {}) {
    console.log('follow user:', user.id);

    UserAPI.follow(user.id).then(() => {
      cb(null);
    }).catch(err => {
      cb(err);
    });
  }

});

export default ViewingProfileStore;