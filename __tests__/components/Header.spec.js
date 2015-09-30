'use strict';

import React       from 'react/addons';

import TestHelpers from '../../utils/testHelpers';
import Header      from '../../app/js/components/Header';
import UserActions from '../../app/js/actions/UserActions';

const  TestUtils   = React.addons.TestUtils;

require('../../utils/createAuthenticatedSuite')('Component: Header', function() {

  let user = TestHelpers.fixtures.user;

  it('should not render notifications or user dropdown if there is no currentUser', function(done) {
    let header = TestHelpers.renderStubbedComponent(Header, { currentUser: {} });

    TestUtils.scryRenderedDOMComponentsWithClass(header, 'notification-center').length.should.equal(0);
    TestUtils.scryRenderedDOMComponentsWithClass(header, 'dropdown-toggle-container').length.should.equal(0);

    done();
  });

  it('should render notifications or user dropdown if there is a currentUser', function(done) {
    let header = TestHelpers.renderStubbedComponent(Header, { currentUser: user });

    TestUtils.scryRenderedDOMComponentsWithClass(header, 'notification-center').length.should.equal(1);
    TestUtils.scryRenderedDOMComponentsWithClass(header, 'dropdown-toggle-container').length.should.equal(1);

    done();
  });

  it('should render user dropdown menu on toggle click', function(done) {
    let spy = sandbox.spy();
    let header = TestHelpers.renderStubbedComponent(Header, { currentUser: user, showContextMenu: spy });
    let dropdownToggle = header.refs.dropdownToggle.getDOMNode();

    console.log('about to click');
    TestUtils.Simulate.click(dropdownToggle);
    console.log('did click');

    sinon.assert.calledOnce(spy);

    done();
  });

  it('#handleKeyPress should do search when user presses \'enter\' in search box', function(done) {
    let header = TestHelpers.renderStubbedComponent(Header, { currentUser: user });
    let searchInput = header.refs.SearchBar.refs.input.getDOMNode();

    sandbox.mock(header).expects('doGlobalSearch').once();
    TestUtils.Simulate.change(searchInput, { target: { value: 'test' } });
    TestUtils.Simulate.keyDown(searchInput, {key: 'Enter', keyCode: 13, which: 13});

    done();
  });

  it('#doGlobalSearch should redirect to /search/tracks', function(done) {
    let header = TestHelpers.renderStubbedComponent(Header, { currentUser: user });
    let searchInput = header.refs.SearchBar.refs.input.getDOMNode();

    sandbox.mock(header).expects('navigateTo').once().withArgs(`/search/tracks`, { q: 'test' });
    TestUtils.Simulate.change(searchInput, { target: { value: 'test' } });
    header.doGlobalSearch();

    done();
  });

  it('#logoutUser should call the logout action', function(done) {
    let header = TestHelpers.renderStubbedComponent(Header, { currentUser: user });

    sandbox.mock(UserActions).expects('logout').once();
    header.logoutUser();

    done();
  });

  it('#navigateTo should call history.pushState with the same arguments', function() {
    const header = TestHelpers.renderStubbedComponent(Header, { currentUser: user });
    const history = {
      pushState: sandbox.spy()
    };

    header.history = history;
    header.navigateTo('/test', {});

    sinon.assert.calledWith(history.pushState, null, '/test');
  });

});