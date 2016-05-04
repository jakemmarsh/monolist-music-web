'use strict';

import React              from 'react';
import ReactDOM           from 'react-dom';
import TestUtils          from 'react-addons-test-utils';

import testHelpers        from '../../utils/testHelpers';
import copyObject         from '../../utils/copyObject';
import UserActions        from '../../app/js/actions/UserActions';
import UserActionDropdown from '../../app/js/components/UserActionDropdown';

describe('Component: UserActionDropdown', function() {

  const user = copyObject(testHelpers.fixtures.user);
  let rendered;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <UserActionDropdown currentUser={user} />
    );
  }

  beforeEach(function() {
    renderComponent();
  });

  it('#componentWillUnmount should clear the check interval and turn off document click listener', function() {
    sandbox.mock(document).expects('removeEventListener').withArgs('click', rendered.toggleDropdown);

    rendered.componentWillUnmount();
  });

  it('#toggleDropdown should flip this.state.showDropdown and add a click listener to DOM if true', function() {
    sandbox.mock(document).expects('addEventListener').withArgs('click', rendered.toggleDropdown);
    sandbox.mock(rendered).expects('setState').withArgs({
      showDropdown: true
    });

    rendered.toggleDropdown(testHelpers.createNativeClickEvent());
  });

  it('#toggleDropdown should flip this.state.showDropdown and remove a click listener from DOM if false', function() {
    rendered.setState({ showDropdown: true });
    sandbox.mock(document).expects('removeEventListener').withArgs('click', rendered.toggleDropdown);
    sandbox.mock(rendered).expects('setState').withArgs({
      showDropdown: false
    });

    rendered.toggleDropdown(testHelpers.createNativeClickEvent());
  });

  it('#logoutUser should call evt.preventDefault if evt exists, and the logout action', function() {
    const evt = {
      preventDefault: sandbox.spy()
    };

    sandbox.mock(UserActions).expects('logout').once();

    rendered.logoutUser(evt);

    sinon.assert.calledOnce(evt.preventDefault);
  });

  it('#renderDropdown should only return an element if there is a currentUser and state.showDropdown is true', function() {

    Should(rendered.renderDropdown()).be.undefined();

    rendered.setState({ showDropdown: true });
    Should(rendered.renderDropdown()).not.be.undefined();
  });

  it('clicking the toggle should call #toggleDropdown', function() {

    sandbox.mock(rendered).expects('toggleDropdown').once();

    TestUtils.Simulate.click(ReactDOM.findDOMNode(rendered));
  });

  it('clicking logout should call #logoutUser', function() {

    sandbox.mock(rendered).expects('logoutUser').once();
    rendered.toggleDropdown(testHelpers.createNativeClickEvent());

    TestUtils.Simulate.click(rendered.refs.logoutLink);
  });

});
