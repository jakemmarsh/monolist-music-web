'use strict';

import ga from './ga';

const Analytics = {

  send(state) {
    // Don't log development visits
    if ( window.nodeEnv === 'production' ) {
      ga('send', 'pageview', { 'page': state.path });
    }
  }

};


export default Analytics;
