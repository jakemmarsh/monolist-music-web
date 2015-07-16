'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';
import ExploreAPI    from '../utils/ExploreAPI';

var ExploreStore = Reflux.createStore({

  init() {
    this.playlists = null;

    this.listenTo(GlobalActions.loadExplorePlaylists, this.loadPlaylists);
  },

  loadPlaylists(cb = function(){}) {
    console.log('load explore playlists');

    Promise.all([
      ExploreAPI.getTrending(),
      ExploreAPI.getNewest()
    ]).then(results => {
      this.playlists = {
        trending: results[0],
        newest: results[1]
      };
      cb(null, this.playlists);
      this.trigger(null, this.playlists);
    }).catch(err => {
      cb(err);
      this.trigger(err);
    });
  }

});

export default ExploreStore;