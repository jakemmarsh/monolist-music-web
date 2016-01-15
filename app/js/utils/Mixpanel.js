/* global mixpanel */
'use strict';

import _ from 'lodash';

const Mixpanel = {

  doCall(cb) {
    if ( window.mixpanel && window.nodeEnv === 'production' ) {
      cb();
    }
  },

  loginUser(user) {
    this.doCall(() => {
      window.mixpanel.identify(user.id);
      window.mixpanel.people.set(_.merge(user, {
        '$first_name': user.firstName,
        '$last_name': user.lastName,
        '$created': user.createdAt,
        '$email': user.email
      }));
    });
  },

  logEvent(eventName, data) {
    this.doCall(() => {
      window.mixpanel.track(eventName.toLowerCase(), data);
    });
  }

};

export default Mixpanel;
