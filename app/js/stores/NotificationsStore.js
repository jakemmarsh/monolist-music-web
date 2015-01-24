'use strict';

var Reflux           = require('reflux');

var GlobalActions    = require('../actions/GlobalActions');
var CurrentUserStore = require('../stores/CurrentUserStore');
var UserAPI          = require('../utils/UserAPI');

var NotificationsStore = Reflux.createStore({

  init: function() {
    this.notifications = null;

    this.listenTo(GlobalActions.loadUserNotifications, this.loadNotifications);
    this.listenTo(GlobalActions.markNotificationsAsRead, this.markNotificationsAsRead);
  },

  loadNotifications: function(track, index, cb) {
    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      cb = cb || function() {};

      console.log('get user notifications');

      UserAPI.getNotifications(CurrentUserStore.user.id).then(function(notifications) {
        this.notifications = notifications;
        cb(null, this.notifications);
        this.trigger(null, this.notifications);
      }.bind(this)).catch(function(err) {
        cb(err);
        this.trigger(err);
      }.bind(this));
    }
  },

  markNotificationsAsRead: function(ids, cb) {
    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      cb = cb || function() {};

      console.log('mark notifications as read:', ids);

      UserAPI.markNotificationsAsRead(CurrentUserStore.user.id, ids).then(function(notifications) {
        this.notifications = notifications;
        cb(null, this.notifications);
        this.trigger(null, this.notifications);
      }.bind(this)).catch(function(err) {
        cb(err);
        this.trigger(err);
      }.bind(this));
    }
  }

});

module.exports = NotificationsStore;