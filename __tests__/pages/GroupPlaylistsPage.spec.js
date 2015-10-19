'use strict';

import ReactDOM           from 'react-dom';
import {ListenerMixin}    from 'reflux';

import TestHelpers        from '../../utils/testHelpers';
import GroupPlaylistsPage from '../../app/js/pages/GroupPlaylistsPage';
import CreatePlaylistPage from '../../app/js/pages/CreatePlaylistPage';

describe('Page: GroupPlaylists', function() {

  this.timeout(5000);

  const group = TestHelpers.fixtures.group;

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ViewingPostListStore and load data on mount
    sandbox.mock(ListenerMixin).expects('listenTo');

    TestHelpers.testPage('/', { slug: group.slug }, {}, { group: group }, GroupPlaylistsPage, this.container, (component) => {
      this.page = component;
      sandbox.restore();
      done();
    });
  });

  it('#navigateToCreatePage should set the static property on CreatePlaylistPage and navigate', function() {
    const history = {
      pushState: sandbox.spy()
    };

    this.page.history = history;
    this.page.navigateToCreatePage(TestHelpers.createNativeClickEvent());

    CreatePlaylistPage.group.should.eql(group);
    sinon.assert.calledWith(history.pushState, null, '/playlists/create');
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});