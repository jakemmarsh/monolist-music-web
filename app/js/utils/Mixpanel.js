/* global mixpanel */
'use strict';

function doCall(cb) {
  if ( window.mixpanel && window.nodeEnv === 'production' ) {
    cb();
  }
}

const Mixpanel = {

  loginUser(user) {
    doCall(() => {
      mixpanel.people.set(user);
      mixpanel.identify(user.id);
    });
  },

  logEvent(eventName, data) {
    doCall(() => {
      mixpanel.track(eventName.toLowerCase(), data);
    });
  }

};

export default Mixpanel;
