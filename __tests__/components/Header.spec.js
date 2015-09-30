'use strict';

import React       from 'react/addons';

import TestHelpers from '../../utils/testHelpers';
import Header      from '../../app/js/components/Header';

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
    TestUtils.scryRenderedDOMComponentsWithClass(header, 'user-action-dropdown').length.should.equal(1);

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

  it('#doGlobalSearch should redirect to /search/tracks', function() {
    let header = TestHelpers.renderStubbedComponent(Header, { currentUser: user });
    let searchInput = header.refs.SearchBar.refs.input.getDOMNode();
    let history = {
      pushState: sandbox.spy()
    };

    header.history = history;
    TestUtils.Simulate.change(searchInput, { target: { value: 'test' } });

    header.doGlobalSearch();

    sinon.assert.calledWith(history.pushState, null, `/search/tracks`, { q: 'test' })
  });

});