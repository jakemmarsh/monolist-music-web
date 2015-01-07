'use strict';

var when = require('when');

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

  Notifier.prototype.notify = function(title, content, image) {
    if ( 'Notification' in window && this.hasPermission ) {
      var notification = new window.Notification(title, {
        body: content || null,
        icon: image
      });
    }
  };

  return new Notifier();

})();