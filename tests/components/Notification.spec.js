'use strict';

import TestUtils    from 'react-addons-test-utils';

import TestHelpers  from '../../utils/testHelpers';
import Notification from '../../app/js/components/Notification';

describe('Component: Notification', function() {

  const testNotification = TestHelpers.fixtures.notification;

  it('#handleLinkClick should call evt.preventDefault, this.markAsRead, and redirect', function() {
    const notification = TestHelpers.renderStubbedComponent(Notification, { notification: testNotification });
    const evt = {
      preventDefault: sandbox.spy()
    };
    const history = {
      pushState: sandbox.spy()
    };
    const url = 'test';

    notification.history = history;
    sandbox.mock(notification).expects('markAsRead').once();

    notification.handleLinkClick(url, evt);

    sinon.assert.calledOnce(evt.preventDefault);
    sinon.assert.calledWith(history.pushState, null, url);
  });

  it('#markAsRead should call evt.preventDefault if present, then call props.markAsRead', function() {
    const spy = sandbox.spy();
    const notification = TestHelpers.renderStubbedComponent(Notification, {
      notification: testNotification,
      markAsRead: spy
    });
    const evt = {
      preventDefault: sandbox.spy()
    };

    notification.markAsRead(evt);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledOnce(evt.preventDefault);
  });

  it('#renderMarkAsReadButton should only return an element if notification is unread', function() {
    const notificationCopy = JSON.parse(JSON.stringify(testNotification));
    notificationCopy.read = true;
    let notification = TestHelpers.renderStubbedComponent(Notification, { notification: notificationCopy });

    Should(notification.renderMarkAsReadButton()).be.undefined();

    notification = TestHelpers.renderStubbedComponent(Notification, { notification: testNotification });

    Should(notification.renderMarkAsReadButton()).not.be.undefined();
  });


  it('#renderEntityLink should only return a link if the entityType requires a link, otherwise a span', function() {
    const notificationCopy = JSON.parse(JSON.stringify(testNotification));
    notificationCopy.entityType = 'track';
    let notification = TestHelpers.renderStubbedComponent(Notification, { notification: notificationCopy });

    notification.renderEntityLink().type.should.eql('span');

    notification = TestHelpers.renderStubbedComponent(Notification, { notification: testNotification });

    notification.renderEntityLink().type.should.eql('a');
  });

  it('clicking the markAsRead button should call #markAsRead', function() {
    const notification = TestHelpers.renderStubbedComponent(Notification, {
      notification: testNotification,
      markAsRead: function() {}
    });
    const markAsReadButton = notification.refs.markAsReadButton;

    sandbox.mock(notification).expects('markAsRead').once();

    TestUtils.Simulate.click(markAsReadButton);
  });

});
