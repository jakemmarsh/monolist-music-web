'use strict';

var when = require('when');
var _    = require('lodash');

module.exports = (function() {

  function Notifier() {
    this.hasPermission = false;

    this.getPermission().then(function(result) {
      this.hasPermission = result;
    }.bind(this));
  }

  Notifier.prototype.getPermission = function() {
    var deferred = when.defer();

    if ( window.Notification.permission === 'granted' ) {
      deferred.resolve(true);
    } else {
      window.Notification.requestPermission(function(permission) {
        if ( permission === 'granted' ) {
          deferred.resolve(true);
        } else {
          deferred.reject(false);
        }
      });
    }

    return deferred.promise;
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