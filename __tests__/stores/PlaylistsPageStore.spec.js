'use strict';

import PlaylistsPageStore from '../../app/js/stores/PlaylistsPageStore'; // eslint-disable-line no-unused-vars
import GlobalActions      from '../../app/js/actions/GlobalActions';
import PlaylistAPI        from '../../app/js/utils/PlaylistAPI';

describe('Store: PlaylistsPage', function() {

  it('should load trending and newest playlists on action', function(done) {
    const getTrendingStub = sandbox.stub(PlaylistAPI, 'getTrending').resolves();
    const getNewestStub = sandbox.stub(PlaylistAPI, 'getNewest').resolves();

    GlobalActions.loadPlaylistsPage(() => {
      sinon.assert.calledOnce(getTrendingStub);
      sinon.assert.calledOnce(getNewestStub);
      done();
    });
  });

});
