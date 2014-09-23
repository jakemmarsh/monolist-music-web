'use strict';

var Helpers = {

  formatSecondsAsTime: function(seconds) {
    var hr  = Math.floor(seconds / 3600);
    var min = Math.floor((seconds - (hr * 3600))/60);
    var sec = Math.floor(seconds - (hr * 3600) -  (min * 60));

    if (sec < 10){
      sec  = '0' + sec;
    }

    return min + ':' + sec;
  },

  isActiveLink: function() {

  }

};

module.exports = Helpers;