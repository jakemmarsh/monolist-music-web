'use strict';

import React        from 'react';
import TestUtils    from 'react-addons-test-utils';

import testHelpers  from '../../utils/testHelpers';
import copyObject   from '../../utils/copyObject';
import Notification from '../../app/js/components/Notification';

describe('Component: Notification', function() {

  const NOTIFICATION = copyObject(testHelpers.fixtures.notification);
  const USER = copyObject(testHelpers.fixtures.user);
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <Notification {...props} />
    );
  }

  beforeEach(function() {
    props = {
      notification: NOTIFICATION,
      markAsRead: sandbox.stub(),
      currentUser: copyObject(USER)
    };
  });

  it('#handleLinkClick should call evt.preventDefault, this.markAsRead, and redirect', function() {
    const evt = {
      preventDefault: sandbox.stub()
    };
    const history = {
      pushState: sandbox.stub()
    };
    const url = 'test';

    renderComponent();

    rendered.history = history;
    sandbox.mock(rendered).expects('markAsRead').once();

    rendered.handleLinkClick(url, evt);

    sinon.assert.calledOnce(evt.preventDefault);
    sinon.assert.calledWith(history.pushState, null, url);
  });

  it('#markAsRead should call evt.preventDefault if present, then call props.markAsRead', function() {
    const evt = {
      preventDefault: sandbox.stub()
    };

    renderComponent();

    rendered.markAsRead(evt);

    sinon.assert.calledOnce(props.markAsRead);
    sinon.assert.calledOnce(evt.preventDefault);
  });

  it('#renderMarkAsReadButton should only return an element if notification is unread', function() {
    const notificationCopy = copyObject(NOTIFICATION);
    notificationCopy.read = true;
    props.notification = notificationCopy;
    renderComponent();

    Should(rendered.renderMarkAsReadButton()).be.undefined();

    props.notification = NOTIFICATION;
    renderComponent();

    Should(rendered.renderMarkAsReadButton()).not.be.undefined();
  });


  it('#renderEntityLink should only return a link if the entityType requires a link, otherwise a span', function() {
    const notificationCopy = copyObject(NOTIFICATION);
    notificationCopy.entityType = 'track';
    props.notification = notificationCopy;
    renderComponent();

    rendered.renderEntityLink().type.should.eql('span');

    props.notification = NOTIFICATION;
    renderComponent();

    rendered.renderEntityLink().type.should.eql('a');
  });

  it('clicking the markAsRead button should call #markAsRead', function() {
    renderComponent();
    const markAsReadButton = rendered.refs.markAsReadButton;

    sandbox.mock(rendered).expects('markAsRead').once();

    TestUtils.Simulate.click(markAsReadButton);
  });

});
