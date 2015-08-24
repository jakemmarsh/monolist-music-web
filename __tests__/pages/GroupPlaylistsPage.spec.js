'use strict';

import React              from 'react/addons';

import TestHelpers        from '../../utils/testHelpers';
import GroupPlaylistsPage from '../../app/js/pages/GroupPlaylistsPage';
import GroupActions       from '../../app/js/actions/GroupActions';

describe('Page: GroupPlaylists', function() {

  let group = TestHelpers.fixtures.group;

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    TestHelpers.testPage('/group/' + group.slug + '/playlists', GroupPlaylistsPage, this.container, (component) => {
      this.page = component;
      this.page.setState({ group: group });
      sandbox.restore();
      done();
    });
  });

  it('should exist', function(done) {
    Should.exist(this.page.getDOMNode());
    done();
  });

  it('should load playlists on mount if group exists', function(done) {
    sandbox.mock(GroupActions).expects('loadPlaylists').once();

    this.page.props.group = group;
    this.page.componentDidMount();

    done();
  });

  it('should load playlists on update if group exists and is new', function(done) {
    let prevProps = {
      group: {}
    };

    sandbox.mock(GroupActions).expects('loadPlaylists').once();

    this.page.props.group = group;
    this.page.componentDidUpdate(prevProps);

    done();
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});