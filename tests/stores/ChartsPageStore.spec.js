'use strict';

import ChartsPageStore from '../../app/js/stores/ChartsPageStore'; // eslint-disable-line no-unused-vars
import GlobalActions   from '../../app/js/actions/GlobalActions';
import PlaylistAPI     from '../../app/js/utils/PlaylistAPI';

describe('Store: ChartsPage', function() {

  it('should load trending and top monthly playlists on action', function(done) {
    sandbox.stub(PlaylistAPI, 'getTrending').resolves();
    sandbox.stub(PlaylistAPI, 'getTopForWindow').resolves();

    GlobalActions.loadChartsPage(() => {
      sinon.assert.calledOnce(PlaylistAPI.getTrending);
      sinon.assert.calledOnce(PlaylistAPI.getTopForWindow);
      sinon.assert.calledWith(PlaylistAPI.getTopForWindow, 'month');
      done();
    });
  });

});
