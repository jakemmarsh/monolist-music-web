'use strict';

import React              from 'react/addons';
import {ListenerMixin}    from 'reflux';

import TestHelpers        from '../../utils/testHelpers';
import PlaylistSearchPage from '../../app/js/pages/PlaylistSearchPage';
import GlobalActions      from '../../app/js/actions/GlobalActions';

const  TestUtils   = React.addons.TestUtils;

describe('Page: PlaylistSearch', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to PlaylistSearchStore on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();

    TestHelpers.testPage('/search/playlists?q=test', PlaylistSearchPage, this.container, (component) => {
      this.page = component;
      sandbox.restore();
      done();
    });
  });

  it('should exist', function(done) {
    Should.exist(this.page.getDOMNode());
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
    sandbox.mock(GlobalActions).expects('doPlaylistSearch');
    this.page.doSearch();

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