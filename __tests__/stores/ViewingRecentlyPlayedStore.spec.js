'use strict';

import when                       from 'when';

import ViewingRecentlyPlayedStore from '../../app/js/stores/ViewingRecentlyPlayedStore';
import GlobalActions              from '../../app/js/actions/GlobalActions';
import PlaylistAPI                from '../../app/js/utils/PlaylistAPI';

describe('Store: ViewingRecentlyPlayed', function() {

  it('should load recent playlist searches on action', function(done) {
    const getRecentlyPlayedStub = sandbox.stub(PlaylistAPI, 'getRecentlyPlayed').returns(when());

    GlobalActions.loadExploreRecentlyPlayed(() => {
      sinon.assert.calledOnce(getRecentlyPlayedStub);
      done();
    });
  });

});
