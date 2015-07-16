'use strict';

import Reflux           from 'reflux';

import GlobalActions    from '../actions/GlobalActions';
import CurrentUserStore from './CurrentUserStore';
import UserAPI          from '../utils/UserAPI';

var UserLikesStore = Reflux.createStore({

  init() {
    this.currentUserLikes = null;

    this.listenTo(GlobalActions.loadUserLikes, this.loadCurrentUserLikes);
  },

  loadCurrentUserLikes(cb = function() {}) {
    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      console.log('load current user\'s liked playlists');

      UserAPI.getLikes(CurrentUserStore.user.id).then(playlists => {
        this.currentUserLikes = playlists;
        cb(this.currentUserLikes);
        this.trigger(this.currentUserLikes);
      });
    }
  }

});

export default UserLikesStore;