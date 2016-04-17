'use strict';

import HomePageStore from '../../app/js/stores/HomePageStore'; // eslint-disable-line no-unused-vars
import GlobalActions from '../../app/js/actions/GlobalActions';
import PlaylistAPI   from '../../app/js/utils/PlaylistAPI';

describe('Store: HomePage', function() {

  it('should load trending and top monthly playlists on action', function(done) {
    const userId = 3;

    sandbox.stub(PlaylistAPI, 'getTrending').resolves();
    sandbox.stub(PlaylistAPI, 'getGlobalRecentlyPlayed').resolves();
    sandbox.stub(PlaylistAPI, 'getNewest').resolves();

    GlobalActions.loadHomePage(userId, () => {
      sinon.assert.calledOnce(PlaylistAPI.getUserRecentlyPlayed);
      sinon.assert.calledWith(PlaylistAPI.getUserRecentlyPlayed, userId, sinon.match.func);
      sinon.assert.calledOnce(PlaylistAPI.getGlobalRecentlyPlayed);
      sinon.assert.calledOnce(PlaylistAPI.getNewest);
      done();
    });
  });

});
