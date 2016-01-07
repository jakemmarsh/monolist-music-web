'use strict';

import when               from 'when';

import PlaylistsPageStore from '../../app/js/stores/PlaylistsPageStore';
import GlobalActions      from '../../app/js/actions/GlobalActions';
import PlaylistAPI        from '../../app/js/utils/PlaylistAPI';

describe('Store: PlaylistsPage', function() {

  it('should load trending and newest playlists on action', function(done) {
    const getTrendingStub = sandbox.stub(PlaylistAPI, 'getTrending').returns(when());
    const getNewestStub = sandbox.stub(PlaylistAPI, 'getNewest').returns(when());

    GlobalActions.loadPlaylistsPage(() => {
      sinon.assert.calledOnce(getTrendingStub);
      sinon.assert.calledOnce(getNewestStub);
      done();
    });
  });

});