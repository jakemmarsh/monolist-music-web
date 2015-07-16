'use strict';

import _ from 'lodash';

export default (function() {

  function Notifier() {
    this.hasPermission = false;

    this.getPermission().then(function(result) {
      this.hasPermission = result;
    }.bind(this));
  }

  Notifier.prototype.getPermission = function() {
    return new Promise((resolve, reject) => {
      if ( window.Notification.permission === 'granted' ) {
        resolve(true);
      } else {
        window.Notification.requestPermission(function(permission) {
          if ( permission === 'granted' ) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      }
    });
  };

  Notifier.prototype.notify = function(title, body, image) {
    if ( 'Notification' in window && this.hasPermission ) {
      var content = {};
      var notification;

      if ( !_.isEmpty(body) ) {
        content.body = body;
      }

      if ( !_.isEmpty(image) ) {
        content.icon = image;
      }

      notification = new window.Notification(title, content);
    }
  };

  return new Notifier();

})();