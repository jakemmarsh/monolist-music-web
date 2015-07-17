'use strict';

import React from 'react/addons';

var ExploreRedirect = React.createClass({

  statics: {
    willTransitionTo(transition, params) {
      transition.redirect('Explore', params);
    }
  },

  render() {
    return;
  }

});

export default ExploreRedirect;