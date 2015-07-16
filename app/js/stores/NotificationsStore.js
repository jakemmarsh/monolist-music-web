'use strict';

import Reflux           from 'reflux';

import GlobalActions    from '../actions/GlobalActions';
import CurrentUserStore from '../stores/CurrentUserStore';
import UserAPI          from '../utils/UserAPI';

var NotificationsStore = Reflux.createStore({

  init() {
    this.notifications = null;

    this.listenTo(GlobalActions.loadUserNotifications, this.loadNotifications);
    this.listenTo(GlobalActions.markNotificationsAsRead, this.markNotificationsAsRead);
  },

  loadNotifications(track, index, cb = function() {}) {
    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      console.log('get user notifications');

      UserAPI.getNotifications(CurrentUserStore.user.id).then(notifications => {
        this.notifications = notifications;
        cb(null, this.notifications);
        this.trigger(null, this.notifications);
      }).catch(err => {
        cb(err);
        this.trigger(err);
      });
    }
  },

  markNotificationsAsRead(ids, cb = function() {}) {
    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      console.log('mark notifications as read:', ids);

      UserAPI.markNotificationsAsRead(CurrentUserStore.user.id, ids).then(notifications => {
        this.notifications = notifications;
        cb(null, this.notifications);
        this.trigger(null, this.notifications);
      }).catch(err => {
        cb(err);
        this.trigger(err);
      });
    }
  }

});

export default NotificationsStore;