'use strict';

import React         from 'react/addons';
import {ListenerMixin} from 'reflux';

import TestHelpers   from '../../utils/testHelpers';
import ExplorePage   from '../../app/js/pages/ExplorePage';
import GlobalActions from '../../app/js/actions/GlobalActions';
import ExploreStore  from '../../app/js/stores/ExploreStore';

describe('Page: Explore', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ExploreStore and load playlists on mount
    sandbox.mock(ListenerMixin).expects('listenTo').once();
    sandbox.mock(GlobalActions).expects('loadExplorePlaylists');

    TestHelpers.testPage('/', ExplorePage, this.container, (component) => {
      this.page = component;
      sandbox.restore();
      done();
    });
  });

  it('should exist', function(done) {
    Should.exist(this.page.getDOMNode());
    done();
  });

  it('should call _onExplorePlaylistsChange when store is triggered', function(done) {
    sandbox.mock(this.page).expects('_onExplorePlaylistsChange');
    ExploreStore.trigger(null, {
      trending: [],
      newest: []
    });

    done();
  });

  it('should reload playlists if receives a new user on update', function(done) {
    var newUser = { id: 17 };

    sandbox.mock(GlobalActions).expects('loadExplorePlaylists');
    this.page.props.currentUser = newUser; // TODO: is this the best way to do this?
    this.page.componentDidUpdate({});

    done();
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});