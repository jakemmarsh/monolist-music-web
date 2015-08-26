'use strict';

import React       from 'react/addons';
import $           from 'jquery';

import TestHelpers from '../../utils/testHelpers';
import Header      from '../../app/js/components/Header';

const  TestUtils   = React.addons.TestUtils;

require('../../utils/createAuthenticatedSuite')('Component: Header', function() {

  let user = TestHelpers.fixtures.user;

  it('should not render notifications or user dropdown if there is no currentUser', function(done) {
    let HeaderComponent = TestHelpers.stubRouterContext(Header, { currentUser: {} });
    let $header = $(TestUtils.renderIntoDocument(React.createElement(HeaderComponent)).getDOMNode());

    $header.find('.notification-center').length.should.eql(0);
    $header.find('.dropdown-toggle-container').length.should.eql(0);

    done();
  });

  it('should render notifications or user dropdown if there is a currentUser', function(done) {
    let HeaderComponent = TestHelpers.stubRouterContext(Header, { currentUser: user });
    let $header = $(TestUtils.renderIntoDocument(React.createElement(HeaderComponent)).getDOMNode());

    $header.find('.notification-center').length.should.eql(1);
    $header.find('.dropdown-toggle-container').length.should.eql(1);

    done();
  });

  it('should render user dropdown menu on toggle click', function(done) {
    let HeaderComponent = TestHelpers.stubRouterContext(Header, { currentUser: user });
    let header = TestUtils.renderIntoDocument(React.createElement(HeaderComponent));
    let $header = $(header);

    // TODO: why can't I access any of the functions on header
    sandbox.mock(header).expects('showUserDropdownMenu').once();

    $(header).find('.dropdown-toggle-container').click();
    $('.dropdown-menu').length.should.eql(1);

    done();
  });

  it('#handleKeyPress should do search when user presses \'enter\' in search box', function(done) {
    let HeaderComponent = TestHelpers.stubRouterContext(Header, { currentUser: user });
    let header = TestUtils.renderIntoDocument(React.createElement(HeaderComponent));
    let $header = $(header);
    let searchInput = header.refs.SearchBar.refs.input.getDOMNode();

    sandbox.mock(header).expects('doGlobalSearch').once();
    TestUtils.Simulate.change(searchInput, { target: { value: 'test' } });
    TestUtils.Simulate.keyDown(searchInput, {key: 'Enter', keyCode: 13, which: 13});

    done();
  });

  it('#doGlobalSearch should redirect to TrackSearch', function(done) {
    let HeaderComponent = TestHelpers.stubRouterContext(Header, { currentUser: user });
    let header = TestUtils.renderIntoDocument(React.createElement(HeaderComponent));
    let $header = $(header);
    let searchInput = header.refs.SearchBar.refs.input.getDOMNode();

    TestUtils.Simulate.change(searchInput, { target: { value: 'test' } });
    sandbox.mock(header).expects('transitionTo').withArgs('TrackSearch', {}, { q: 'test' });
    header.doGlobalSearch();

    done();
  });

});