'use strict';

import ReactDOM                   from 'react-dom';
import {ListenerMixin}            from 'reflux';

import TestHelpers                from '../../utils/testHelpers';
import ExplorePage                from '../../app/js/pages/ExplorePage';
import GlobalActions              from '../../app/js/actions/GlobalActions';
import ViewingPostListStore       from '../../app/js/stores/ViewingPostListStore';
import ViewingRecentSearchesStore from '../../app/js/stores/ViewingRecentSearchesStore';

describe('Page: Explore', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ViewingPostListStore and load data on mount
    sandbox.mock(ListenerMixin).expects('listenTo');
    sandbox.mock(GlobalActions).expects('loadExplorePage');

    TestHelpers.testPage('/', {}, {}, {}, ExplorePage, this.container, (component) => {
      this.page = component;
      ListenerMixin.listenTo.restore();
      GlobalActions.loadExplorePage.restore();
      done();
    });
  });

  it('should call _onPostsChange when post list store is triggered', function(done) {
    sandbox.mock(this.page).expects('_onPostsChange');

    ViewingPostListStore.trigger(null, []);

    done();
  });

  it('should call _onRecentSearchesChange when store is triggered', function(done) {
    sandbox.mock(this.page).expects('_onRecentSearchesChange');

    ViewingRecentSearchesStore.trigger(null, []);

    done();
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});