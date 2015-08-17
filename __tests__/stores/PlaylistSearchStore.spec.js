'use strict';

import when                from 'when';

import PlaylistSearchStore from '../../app/js/stores/PlaylistSearchStore';
import GlobalActions       from '../../app/js/actions/GlobalActions';
import SearchAPI           from '../../app/js/utils/SearchAPI';

describe('Store: PlaylistSearch', function() {

  beforeEach(function() {
    this.searchApiMock = sandbox.mock(SearchAPI);
  });

  it('should search playlists on action', function(done) {
    let query = 'test';

    this.searchApiMock.expects('playlistSearch').withArgs(query).returns(when());

    GlobalActions.doPlaylistSearch(query);

    done();
  });

});