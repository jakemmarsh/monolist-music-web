'use strict';

import NotificationsStore from '../../app/js/stores/NotificationsStore'; // eslint-disable-line no-unused-vars
import CurrentUserStore   from '../../app/js/stores/CurrentUserStore';
import GlobalActions      from '../../app/js/actions/GlobalActions';
import UserAPI            from '../../app/js/utils/UserAPI';

describe('Store: Notifications', function() {

  beforeEach(function() {
    CurrentUserStore.user = { id: 1 };
  });

  it('should load the notifications for the current user on action', function(done) {
    const getNotificationsStub = sandbox.stub(UserAPI, 'getNotifications').resolves();

    GlobalActions.loadUserNotifications(() => {
      sinon.assert.calledOnce(getNotificationsStub);
      sinon.assert.calledWith(getNotificationsStub, CurrentUserStore.user.id);
      done();
    });
  });

  it('should mark notifications as read on action', function(done) {
    const notificationIds = [1, 2, 3];
    const markAsReadStub = sandbox.stub(UserAPI, 'markNotificationsAsRead').resolves();

    GlobalActions.markNotificationsAsRead(notificationIds, () => {
      sinon.assert.calledOnce(markAsReadStub);
      sinon.assert.calledWith(markAsReadStub, CurrentUserStore.user.id, notificationIds);
      done();
    });
  });

});
