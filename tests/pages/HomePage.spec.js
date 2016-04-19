'use strict';

import ReactDOM        from 'react-dom';
import {ListenerMixin} from 'reflux';

import TestHelpers     from '../../utils/testHelpers';
import GlobalActions   from '../../app/js/actions/GlobalActions';
import HomePage        from '../../app/js/pages/HomePage';
import HomePageStore   from '../../app/js/stores/HomePageStore';

describe('Page: Home', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ViewingPlaylistStore and load playlist on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();
    sandbox.mock(GlobalActions).expects('loadHomePage').once();

    TestHelpers.testPage('/playlists', {}, {}, {}, HomePage, this.container, (component) => {
      this.page = component;
      done();
    });
  });

  it('should call _onPlaylistsChange when store is triggered', function(done) {
    sandbox.mock(this.page).expects('_onPlaylistsChange');
    HomePageStore.trigger(null, {
      userRecentlyPlayed: [],
      globalRecentlyPlayed: [],
      newest: []
    });

    done();
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});
