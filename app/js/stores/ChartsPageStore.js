'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';
import PlaylistAPI   from '../utils/PlaylistAPI';

const ChartsPageStore = Reflux.createStore({

  init() {
    this.playlists = {
      trending: [],
      topMonthly: []
    };

    this.listenTo(GlobalActions.loadChartsPage, this.loadPlaylists);
  },

  loadPlaylists(cb = function() {}) {
    const promises = [
      PlaylistAPI.getTrending(),
      PlaylistAPI.getTopForWindow('month')
    ];

    Promise.all(promises).then((results) => {
      this.playlists = {
        trending: results[0] || [],
        topMonthly: results[1] || []
      };

      cb(null, this.playlists);
      this.trigger(null, this.playlists);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  }

});

export default ChartsPageStore;
