'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';
import PlaylistAPI   from '../utils/PlaylistAPI';

const HomePageStore = Reflux.createStore({

  init() {
    this.playlists = {
      userRecentlyPlayed: [],
      globalRecentlyPlayed: [],
      newest: []
    };

    this.listenTo(GlobalActions.loadHomePage, this.loadPlaylists);
  },

  loadPlaylists(userId, cb = function() {}) {
    const hasUserId = !!userId;
    let promises;

    if ( hasUserId ) {
      promises = [
        PlaylistAPI.getUserRecentlyPlayed(userId),
        PlaylistAPI.getGlobalRecentlyPlayed(),
        PlaylistAPI.getNewest()
      ];
    } else {
      promises = [
        PlaylistAPI.getGlobalRecentlyPlayed(),
        PlaylistAPI.getNewest()
      ];
    }

    Promise.all(promises).then((results) => {
      this.playlists = {
        userRecentlyPlayed: hasUserId ? results[0] : [],
        globalRecentlyPlayed: hasUserId ? results[1] : results[0],
        newest: hasUserId ? results[2] : results[1]
      };

      cb(null, this.playlists);
      this.trigger(null, this.playlists);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  }

});

export default HomePageStore;
