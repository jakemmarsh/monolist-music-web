/* global mixpanel */
'use strict';

import _              from 'lodash';

const CENSORED_FIELDS = ['password', 'hash'];
const CENSORED_VALUE  = '<< CENSORED >>';

const Mixpanel = {

  censorData(data) {
    let dataCopy = JSON.parse(JSON.stringify(data));

    _.forIn(dataCopy, (val, key) => {
      if ( _.indexOf(CENSORED_FIELDS, key) !== -1 ) {
        dataCopy[key] = CENSORED_VALUE;
      }
    });

    return dataCopy;
  },

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
      window.mixpanel.track(eventName.toLowerCase(), this.censorData(data));
    });
  }

};

export default Mixpanel;
