'use strict';

import React              from 'react';
import TestUtils          from 'react-addons-test-utils';

import TestHelpers        from '../../utils/testHelpers';
import GlobalActions      from '../../app/js/actions/GlobalActions';
import NotificationCenter from '../../app/js/components/NotificationCenter';
import NotificationsStore from '../../app/js/stores/NotificationsStore';

describe('Component: NotificationCenter', function() {

  const USER = TestHelpers.fixtures.user;
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <NotificationCenter {...props} />
    );
  }

  beforeEach(function() {
    props = {};
  });

  it('#_onNotificationsChange should clear interval and set error state on error', function() {
    const err = {
      message: 'Test error'
    };

    props.currentUser = USER;
    renderComponent();

    sandbox.mock(window).expects('clearInterval').withArgs(rendered.interval);
    sandbox.mock(rendered).expects('setState').withArgs({ error: err });

    rendered._onNotificationsChange(err, []);
  });

  it('#_onNotificationsChange should correctly set the state if no error', function() {
    const newNotifications = [{ id: 3 }, { id: 5 }];

    renderComponent();

    sandbox.mock(rendered).expects('setState').once().withArgs({
      notifications: newNotifications,
      error: null
    });

    rendered._onNotificationsChange(null, newNotifications);
  });

  it('#componentDidUpdate should clear interval if new user is empty', function() {
    props.currentUser = USER;
    renderComponent();

    sandbox.mock(window).expects('clearInterval').withArgs(rendered.interval);

    rendered.componentDidUpdate({ currentUser: {} });
  });

  it('#componentDidUpdate should retrieve notifications if a new user is received', function() {
    props.currentUser = USER;
    renderComponent();

    sandbox.mock(GlobalActions).expects('loadUserNotifications').once();

    rendered.componentDidUpdate({ currentUser: { id: 3 } });
  });

  it('#componentDidMount should listen to the notifications store, load notifications, and set the check interval', function() {
    renderComponent();

    sandbox.mock(rendered).expects('listenTo').once().withArgs(NotificationsStore, rendered._onNotificationsChange);
    sandbox.mock(GlobalActions).expects('loadUserNotifications');

    rendered.componentDidMount();

    Should(rendered.interval).not.be.undefined();
  });

  it('#componentWillUnmount should clear the check interval and turn off document click listener', function() {
    renderComponent();

    window.clearInterval = sandbox.stub();
    sandbox.mock(document).expects('removeEventListener').withArgs('click', rendered.toggleDropdown);

    rendered.componentWillUnmount();
    sinon.assert.calledWith(window.clearInterval, rendered.interval);
  });

  it('#toggleDropdown should flip this.state.showDropdown and add a click listener to DOM if true', function() {
    renderComponent();

    sandbox.mock(document).expects('addEventListener').withArgs('click', rendered.toggleDropdown);
    sandbox.mock(rendered).expects('setState').withArgs({
      showDropdown: true
    });

    rendered.toggleDropdown(TestHelpers.createNativeClickEvent());
  });

  it('#toggleDropdown should flip this.state.showDropdown and remove a click listener from DOM if false', function() {
    renderComponent();

    rendered.setState({ showDropdown: true });
    sandbox.mock(document).expects('removeEventListener').withArgs('click', rendered.toggleDropdown);
    sandbox.mock(rendered).expects('setState').withArgs({
      showDropdown: false
    });

    rendered.toggleDropdown(TestHelpers.createNativeClickEvent());
  });

  it('#getNumNew should return the number of notifications where `read` is false', function() {
    const notifications = [{ read: false }, { read: false }, { read: true }];

    renderComponent();

    rendered.setState({ notifications: notifications });

    rendered.getNumNew().should.eql(2);
  });

  it('#markAsRead should call the read action with the specific notification', function() {
    const notification = { id: 1 };

    renderComponent();

    sandbox.mock(GlobalActions).expects('markNotificationsAsRead').once().withArgs(notification.id);

    rendered.markAsRead(notification);
  });

  it('#markAllAsRead should pluck the IDs from all notifications and call the read action', function() {
    const notifications = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const ids = [1, 2, 3];

    renderComponent();

    rendered.setState({ notifications: notifications });
    sandbox.mock(GlobalActions).expects('markNotificationsAsRead').withArgs(ids);

    rendered.markAllAsRead(TestHelpers.createNativeClickEvent());
  });

  it('#renderDropdown should only return an element if there is a currentUser and state.showDropdown is true', function() {
    props.currentUser = USER;
    renderComponent();

    Should(rendered.renderDropdown()).be.undefined();

    rendered.setState({ showDropdown: true });
    Should(rendered.renderDropdown()).not.be.undefined();
  });

  it('clicking the toggle should call #toggleDropdown', function() {
    renderComponent();
    const toggle = rendered.refs.notificationsToggle;

    sandbox.mock(rendered).expects('toggleDropdown').once();

    TestUtils.Simulate.click(toggle);
  });

});
