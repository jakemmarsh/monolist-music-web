'use strict';

import Reflux           from 'reflux';
import _                from 'lodash';

import GlobalActions    from '../actions/GlobalActions';
import CurrentUserStore from '../stores/CurrentUserStore';
import UserAPI          from '../utils/UserAPI';

const NotificationsStore = Reflux.createStore({

  init() {
    this.notifications = null;

    this.listenTo(GlobalActions.loadUserNotifications, this.loadNotifications);
    this.listenTo(GlobalActions.markNotificationsAsRead, this.markNotificationsAsRead);
  },

  loadNotifications(cb = function() {}) {
    UserAPI.getNotifications(CurrentUserStore.user.id).then((notifications) => {
      this.notifications = notifications;
      cb(null, this.notifications);
      this.trigger(null, this.notifications);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  },

  markNotificationsAsRead(ids, cb = function() {}) {
    ids = ids.constructor === Array ? ids : [ids];

    UserAPI.markNotificationsAsRead(CurrentUserStore.user.id, ids).then(() => {
      _.each(this.notifications, (notification) => {
        if ( _.contains(ids, notification.id) ) {
          notification.read = true;
        }
      });

      cb(null, this.notifications);
      this.trigger(null, this.notifications);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  }

});

export default NotificationsStore;
