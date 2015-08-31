'use strict';

import when               from 'when';

import PlaylistsPageStore from '../../app/js/stores/PlaylistsPageStore';
import GlobalActions      from '../../app/js/actions/GlobalActions';
import PlaylistAPI        from '../../app/js/utils/PlaylistAPI';

describe('Store: PlaylistsPage', function() {

  beforeEach(function() {
    this.playlistAPIMock = sandbox.mock(PlaylistAPI);
  });

  it('should load trending and newest playlists on action', function(done) {
    this.playlistAPIMock.expects('getTrending').returns(when());
    this.playlistAPIMock.expects('getNewest').returns(when());

    GlobalActions.loadPlaylistsPage();

    done();
  });

});