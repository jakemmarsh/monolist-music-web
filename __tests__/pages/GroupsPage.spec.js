'use strict';

import React           from 'react/addons';
import {ListenerMixin} from 'reflux';

import TestHelpers     from '../../utils/testHelpers';
import GroupsPage      from '../../app/js/pages/GroupsPage';
import GlobalActions   from '../../app/js/actions/GlobalActions';
import GroupActions    from '../../app/js/actions/GroupActions';

const  TestUtils   = React.addons.TestUtils;

describe('Page: Groups', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to GroupsStore and load groups on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();
    sandbox.mock(GlobalActions).expects('loadGroups').once();

    TestHelpers.testPage('/groups', GroupsPage, this.container, (component) => {
      this.page = component;
      sandbox.restore();
      done();
    });
  });

  it('should exist', function(done) {
    Should.exist(this.page.getDOMNode());
    done();
  });

  it('should reload groups if currentUser changes', function(done) {
    let user = TestHelpers.fixtures.user;
    let prevProps = {
      currentUser: {}
    };

    this.page.props.currentUser = user;
    sandbox.mock(GlobalActions).expects('loadGroups').once();
    this.page.componentDidUpdate(prevProps);

    done();
  });

  it('should do search if query changes', function(done) {
    let prevProps = {
      query: {
        q: 'old'
      }
    };

    this.page.props.query.q = 'test';
    sandbox.mock(this.page).expects('doSearch');
    this.page.componentDidUpdate(prevProps);

    done();
  });

  it('should call search action', function(done) {
    let query = 'test';

    this.page.setState({ query: query });
    sandbox.mock(GroupActions).expects('search').withArgs(query);
    this.page.doSearch();

    done();
  });

  it('should do an empty search', function(done) {
    sandbox.mock(GroupActions).expects('search').withArgs(null);

    this.page.doEmptySearch();

    done();
  });

  it('should call doEmptySearch on clear click', function(done) {
    let clearButton = this.page.refs.clearButton.getDOMNode();

    sandbox.mock(this.page).expects('doEmptySearch').once();

    React.addons.TestUtils.Simulate.click(clearButton);

    done();
  });

  it('should reload page on enter key', function(done) {
    let searchBar = this.page.refs.SearchBar;
    let searchInput = searchBar.refs.input.getDOMNode();

    sandbox.mock(this.page).expects('handleKeyPress').once();
    sandbox.mock(this.page).expects('reloadPage').once();

    React.addons.TestUtils.Simulate.change(searchInput, { target: { value: 'test' } });
    React.addons.TestUtils.Simulate.keyDown(searchInput, { key: 'Enter' });

    done();
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});