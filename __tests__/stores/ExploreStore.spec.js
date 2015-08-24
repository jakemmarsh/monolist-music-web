'use strict';

import when          from 'when';

import TestHelpers   from '../../utils/testHelpers';
import ExploreStore  from '../../app/js/stores/ExploreStore';
import GlobalActions from '../../app/js/actions/GlobalActions';
import PostAPI       from '../../app/js/utils/PostAPI';
import PlaylistAPI   from '../../app/js/utils/PlaylistAPI';

describe('Store: Explore', function() {

  let post = TestHelpers.fixtures.post;

  beforeEach(function() {
    this.postApiMock = sandbox.mock(PostAPI);
    this.playlistApiMock = sandbox.mock(PlaylistAPI);
  });

  it('should load all posts and recent searches on action', function(done) {
    this.postApiMock.expects('getNewest').returns(when());
    this.playlistApiMock.expects('getRecentSearches').returns(when());

    GlobalActions.loadExplorePage();

    done();
  });

  it('should create a new global post on action', function(done) {
    this.postApiMock.expects('create').withArgs(post).returns(when());

    GlobalActions.createGlobalPost(post);

    done();
  });

});