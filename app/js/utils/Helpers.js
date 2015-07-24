'use strict';

var Helpers = {

  buildPageTitle(title) {
    return title ? title + ' \u2014 Monolist' : 'Monolist';
  },

  formatSecondsAsTime(seconds) {
    var hr  = Math.floor(seconds / 3600);
    var min = Math.floor((seconds - (hr * 3600))/60);
    var sec = Math.floor(seconds - (hr * 3600) -  (min * 60));

    if (sec < 10){
      sec  = '0' + sec;
    }

    return min + ':' + sec;
  }

};

export default Helpers;