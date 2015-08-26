'use strict';

import when                from 'when';

import PlaylistSearchStore from '../../app/js/stores/PlaylistSearchStore';
import SearchActions       from '../../app/js/actions/SearchActions';
import SearchAPI           from '../../app/js/utils/SearchAPI';

describe('Store: PlaylistSearch', function() {

  beforeEach(function() {
    this.searchApiMock = sandbox.mock(SearchAPI);
  });

  it('should search playlists on action', function(done) {
    let query = 'test';

    this.searchApiMock.expects('playlistSearch').withArgs(query).returns(when());

    SearchActions.searchPlaylists(query);

    done();
  });

});