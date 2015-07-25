'use strict';

var NotificationsStore = require('../../app/js/stores/NotificationsStore');
var CurrentUserStore   = require('../../app/js/stores/CurrentUserStore');
var GlobalActions      = require('../../app/js/actions/GlobalActions');
var UserAPI            = require('../../app/js/utils/UserAPI');

describe('Store: Notifications', function() {

  var mock;

  before(function() {
    mock = sinon.mock(UserAPI);
    CurrentUserStore.user = { id: 1 };
  });

  it('should load the notifications for the current user on action', function(done) {
    mock.expects('getNotifications').withArgs(CurrentUserStore.user.id);

    GlobalActions.loadUserNotifications();

    done();
  });

  it('should mark notifications as read on action', function(done) {
    var notificationIds = [1, 2, 3];

    mock.expects('markNotificationsAsRead').withArgs(CurrentUserStore.user.id, notificationIds);

    GlobalActions.markNotificationsAsRead(notificationIds);

    done();
  });

  after(function() {
    mock.restore();
  });

});