'use strict';

import HomePageStore from '../../app/js/stores/HomePageStore';
import GlobalActions from '../../app/js/actions/GlobalActions';
import PlaylistAPI   from '../../app/js/utils/PlaylistAPI';

describe('Store: HomePage', function() {

  it('should load trending and top monthly playlists on action', function(done) {
    const userId = 3;

    sandbox.stub(PlaylistAPI, 'getUserRecentlyPlayed').resolves();
    sandbox.stub(PlaylistAPI, 'getGlobalRecentlyPlayed').resolves();
    sandbox.stub(PlaylistAPI, 'getNewest').resolves();

    sandbox.stub(HomePageStore, 'trigger', () => {
      sinon.assert.calledOnce(PlaylistAPI.getUserRecentlyPlayed);
      sinon.assert.calledWith(PlaylistAPI.getUserRecentlyPlayed, userId);
      sinon.assert.calledOnce(PlaylistAPI.getGlobalRecentlyPlayed);
      sinon.assert.calledOnce(PlaylistAPI.getNewest);
      done();
    });

    GlobalActions.loadHomePage(userId);
  });

});
