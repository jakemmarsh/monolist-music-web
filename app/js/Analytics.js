'use strict';

import ga from './ga';

const subdomain = window.location.host.split('.')[0];
const hostname = window.location.hostname;

const Analytics = {

  send(state) {
    // Don't log development visits
    if ( subdomain !== 'dev' && hostname !== 'localhost' ) {
      ga('send', 'pageview', { 'page': state.path });
    }
  }

};


export default Analytics;