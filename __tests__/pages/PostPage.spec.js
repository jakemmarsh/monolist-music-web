'use strict';

import ReactDOM         from 'react-dom';
import {ListenerMixin}  from 'reflux';

import TestHelpers      from '../../utils/testHelpers';
import PostActions      from '../../app/js/actions/PostActions';
import PostPage         from '../../app/js/pages/PostPage';
import ViewingPostStore from '../../app/js/stores/ViewingPostStore';

describe('Page: Post', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');

    // Should listen to ViewingPostStore and load playlist on mount
    sandbox.mock(ListenerMixin).expects('listenTo');
    sandbox.mock(PostActions).expects('open').once();

    TestHelpers.testPage('/post/1', { id: 1 }, {}, {}, PostPage, this.container, (component) => {
      this.page = component;
      done();
    });
  });

  it('should call _onPostChange when store is triggered', function(done) {
    sandbox.mock(this.page).expects('_onPostChange');
    ViewingPostStore.trigger(null, {});

    done();
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});