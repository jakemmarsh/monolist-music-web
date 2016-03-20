'use strict';

import ReactDOM           from 'react-dom';
import {ListenerMixin}    from 'reflux';

import TestHelpers        from '../../utils/testHelpers';
import GlobalActions      from '../../app/js/actions/GlobalActions';
import PlaylistsPage      from '../../app/js/pages/PlaylistsPage';
import PlaylistsPageStore from '../../app/js/stores/PlaylistsPageStore';

describe('Page: Playlists', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ViewingPlaylistStore and load playlist on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();
    sandbox.mock(GlobalActions).expects('loadPlaylistsPage').once();

    TestHelpers.testPage('/playlists', {}, {}, {}, PlaylistsPage, this.container, (component) => {
      this.page = component;
      done();
    });
  });

  it('should call _onPlaylistsChange when store is triggered', function(done) {
    sandbox.mock(this.page).expects('_onPlaylistsChange');
    PlaylistsPageStore.trigger(null, {
      trending: [],
      newest: []
    });

    done();
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});
