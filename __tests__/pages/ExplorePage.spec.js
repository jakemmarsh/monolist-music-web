'use strict';

import ReactDOM                   from 'react-dom';
import {ListenerMixin}            from 'reflux';

import TestHelpers                from '../../utils/testHelpers';
import ExplorePage                from '../../app/js/pages/ExplorePage';
import GlobalActions              from '../../app/js/actions/GlobalActions';
import ViewingPostListStore       from '../../app/js/stores/ViewingPostListStore';
import ViewingRecentlyPlayedStore from '../../app/js/stores/ViewingRecentlyPlayedStore';

describe('Page: Explore', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ViewingPostListStore and load data on mount
    sandbox.mock(ListenerMixin).expects('listenTo');
    sandbox.mock(GlobalActions).expects('loadExplorePosts');
    sandbox.mock(GlobalActions).expects('loadExploreSearches');

    TestHelpers.testPage('/', {}, {}, {}, ExplorePage, this.container, (component) => {
      this.page = component;
      ListenerMixin.listenTo.restore();
      GlobalActions.loadExplorePosts.restore();
      GlobalActions.loadExploreSearches.restore();
      done();
    });
  });

  it('should call _onPostsChange when post list store is triggered', function() {
    sandbox.mock(this.page).expects('_onPostsChange');

    ViewingPostListStore.trigger(null, []);
  });

  it('should call _onRecentlyPlayedChange when store is triggered', function() {
    sandbox.mock(this.page).expects('_onRecentlyPlayedChange');

    ViewingRecentlyPlayedStore.trigger(null, []);
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});
