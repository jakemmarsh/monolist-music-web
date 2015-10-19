'use strict';

import ReactDOM           from 'react-dom';
import TestUtils          from 'react-addons-test-utils';
import $                  from 'jquery';

import TestHelpers        from '../../utils/testHelpers';
import UserActions        from '../../app/js/actions/UserActions';
import UserActionDropdown from '../../app/js/components/UserActionDropdown';

describe('Component: UserActionDropdown', function() {

  const user = TestHelpers.fixtures.user;

  it('#componentWillUnmount should clear the check interval and turn off document click listener', function() {
    const dropdown = TestHelpers.renderStubbedComponent(UserActionDropdown, { currentUser: user });

    sandbox.mock($(document)).expects('off').withArgs('click', dropdown.toggleDropdown);

    dropdown.componentWillUnmount();
  });

  it('#toggleDropdown should flip this.state.showDropdown and add a click listener to DOM if true', function() {
    const dropdown = TestHelpers.renderStubbedComponent(UserActionDropdown, { currentUser: user });

    sandbox.mock($(document)).expects('on').withArgs('click', dropdown.toggleDropdown);
    sandbox.mock(dropdown).expects('setState').withArgs({
      showDropdown: true
    });

    dropdown.toggleDropdown(TestHelpers.createNativeClickEvent());
  });

  it('#toggleDropdown should flip this.state.showDropdown and remove a click listener from DOM if false', function() {
    const dropdown = TestHelpers.renderStubbedComponent(UserActionDropdown, { currentUser: user });

    dropdown.setState({ showDropdown: true });
    sandbox.mock($(document)).expects('off').withArgs('click', dropdown.toggleDropdown);
    sandbox.mock(dropdown).expects('setState').withArgs({
      showDropdown: false
    });

    dropdown.toggleDropdown(TestHelpers.createNativeClickEvent());
  });

  it('#logoutUser should call evt.preventDefault if evt exists, and the logout action', function() {
    const dropdown = TestHelpers.renderStubbedComponent(UserActionDropdown, { currentUser: user });
    const evt = {
      preventDefault: sandbox.spy()
    };

    sandbox.mock(UserActions).expects('logout').once();

    dropdown.logoutUser(evt);

    sinon.assert.calledOnce(evt.preventDefault);
  });

  it('#renderDropdown should only return an element if there is a currentUser and state.showDropdown is true', function() {
    const dropdown = TestHelpers.renderStubbedComponent(UserActionDropdown, { currentUser: user });

    Should(dropdown.renderDropdown()).be.undefined();

    dropdown.setState({ showDropdown: true });
    Should(dropdown.renderDropdown()).not.be.undefined();
  });

  it('clicking the toggle should call #toggleDropdown', function() {
    const dropdown = TestHelpers.renderStubbedComponent(UserActionDropdown, { currentUser: user });

    sandbox.mock(dropdown).expects('toggleDropdown').once();

    TestUtils.Simulate.click(ReactDOM.findDOMNode(dropdown));
  });

  it('clicking logout should call #logoutUser', function() {
    const dropdown = TestHelpers.renderStubbedComponent(UserActionDropdown, { currentUser: user });

    sandbox.mock(dropdown).expects('logoutUser').once();
    dropdown.toggleDropdown(TestHelpers.createNativeClickEvent());

    TestUtils.Simulate.click(dropdown.refs.logoutLink);
  });

});