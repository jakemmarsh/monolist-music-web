'use strict';

import when                       from 'when';

import ViewingRecentSearchesStore from '../../app/js/stores/ViewingRecentSearchesStore';
import GlobalActions              from '../../app/js/actions/GlobalActions';
import PostAPI                    from '../../app/js/utils/PostAPI';
import PlaylistAPI                from '../../app/js/utils/PlaylistAPI';

describe('Store: ViewingRecentSearches', function() {

  beforeEach(function() {
    this.playlistApiMock = sandbox.mock(PlaylistAPI);
  });

  it('should load recent playlist searches on action', function() {
    this.playlistApiMock.expects('getRecentSearches').returns(when());
    sandbox.stub(PostAPI, 'getNewest').returns(when()); // Since ViewingPostListStore is also triggered by action
    GlobalActions.loadExplorePage();
  });

});