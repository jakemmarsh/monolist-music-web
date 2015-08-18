'use strict';

import when               from 'when';

import NotificationsStore from '../../app/js/stores/NotificationsStore';
import CurrentUserStore   from '../../app/js/stores/CurrentUserStore';
import GlobalActions      from '../../app/js/actions/GlobalActions';
import UserAPI            from '../../app/js/utils/UserAPI';

describe('Store: Notifications', function() {

  beforeEach(function() {
    this.userApiMock = sandbox.mock(UserAPI);
    CurrentUserStore.user = { id: 1 };
  });

  it('should load the notifications for the current user on action', function(done) {
    this.userApiMock.expects('getNotifications').withArgs(CurrentUserStore.user.id).returns(when());

    GlobalActions.loadUserNotifications();

    done();
  });

  it('should mark notifications as read on action', function(done) {
    let notificationIds = [1, 2, 3];

    this.userApiMock.expects('markNotificationsAsRead').withArgs(CurrentUserStore.user.id, notificationIds).returns(when());

    GlobalActions.markNotificationsAsRead(notificationIds);

    done();
  });

});