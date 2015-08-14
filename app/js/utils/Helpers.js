'use strict';

import _ from 'lodash';

var Helpers = {

  buildPageTitle(title) {
    return title ? title + ' \u2014 Monolist' : 'Monolist';
  },

  formatSecondsAsTime(seconds) {
    var hr  = Math.floor(seconds / 3600);
    var min = Math.floor((seconds - (hr * 3600)) / 60);
    var sec = Math.floor(seconds - (hr * 3600) -  (min * 60));

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