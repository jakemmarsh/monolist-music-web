'use strict';

import when                       from 'when';

import ViewingRecentSearchesStore from '../../app/js/stores/ViewingRecentSearchesStore';
import GlobalActions              from '../../app/js/actions/GlobalActions';
import PlaylistAPI                from '../../app/js/utils/PlaylistAPI';

describe('Store: ViewingRecentSearches', function() {

  beforeEach(function() {
    this.playlistApiMock = sandbox.mock(PlaylistAPI);
  });

  it('should load recent playlist searches on action', function(done) {
    this.playlistApiMock.expects('getRecentSearches').returns(when());

    GlobalActions.loadExplorePage();

    done();
  });

});