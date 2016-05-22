'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';

const GlobalLoadingStore = Reflux.createStore({

  init() {
    this.progress = 0;

    console.log('did init');

    this.listenTo(GlobalActions.updateLoadingProgress, this.updateLoadingProgress);
  },

  updateLoadingProgress(progress = 0) {
    progress = Math.random() * 100;
    if ( progress < 0 || progress >= 100 ) {
      this.progress = 0;
    } else {
      this.progress = progress;
    }

    this.trigger(this.progress);
  }

});

export default GlobalLoadingStore;
