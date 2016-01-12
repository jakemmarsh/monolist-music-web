'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';

const GlobalActionIndicatorStore = Reflux.createStore({

  init() {
    this.listenTo(GlobalActions.triggerSuccessIndicator, this.triggerSuccessIndicator);
    this.listenTo(GlobalActions.triggerFailureIndicator, this.triggerFailIndicator);
  },

  triggerSuccessIndicator() {
    this.trigger(true);
  },

  triggerFailIndicator() {
    this.trigger(false);
  }

});

export default GlobalActionIndicatorStore;
