'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';

const GlobalActionIndicatorStore = Reflux.createStore({

  init() {
    console.log('init');
    this.listenTo(GlobalActions.triggerSuccessIndicator, this.triggerSuccessIndicator);
    this.listenTo(GlobalActions.triggerFailureIndicator, this.triggerFailIndicator);
  },

  triggerSuccessIndicator() {
    console.log('will trigger for success');
    this.trigger(true);
  },

  triggerFailIndicator() {
    console.log('will trigger for fail');
    this.trigger(false);
  }

});

export default GlobalActionIndicatorStore;
