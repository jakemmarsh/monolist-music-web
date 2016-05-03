'use strict';

import _ from 'lodash';

const Helpers = {

  buildPageTitle(title) {
    return title ? title + ' \u2014 Monolist' : 'Monolist';
  },

  formatSecondsAsTime(seconds) {
    const hr  = Math.floor(seconds / 3600);
    const min = Math.floor((seconds - (hr * 3600)) / 60);
    let sec = Math.floor(seconds - (hr * 3600) -  (min * 60));

    if (sec < 10){
      sec  = '0' + sec;
    }

    return min + ':' + sec;
  },

  processObjectKeys(obj, convert) {
    let output;

    if ( _.isDate(obj) || _.isRegExp(obj) || !_.isObject(obj) ) {
      return obj;
    } else if ( _.isArray(obj) ) {
      output = _.map(obj, item => {
        return this.processObjectKeys(item, convert);
      });
    } else {
      output = {};
      _.forOwn(obj, (value, key) => {
        output[convert(key)] = this.processObjectKeys(obj[key], convert);
      });
    }

    return output;
  }

};

export default Helpers;
