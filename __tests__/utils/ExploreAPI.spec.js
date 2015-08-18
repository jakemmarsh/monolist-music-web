'use strict';

import APIUtils   from '../../app/js/utils/APIUtils';
import ExploreAPI from '../../app/js/utils/ExploreAPI';

describe('Util: ExploreAPI', function() {

  beforeEach(function() {
    this.apiUtilsMock = sandbox.mock(APIUtils);
  });

  it('should make a request to get newest playlists', function(done) {
    let path = 'playlists/newest';

    this.apiUtilsMock.expects('get').withArgs(path);

    ExploreAPI.getNewest();

    done();
  });

  it('should make a request to get trending playlists', function(done) {
    let path = 'playlists/trending';

    this.apiUtilsMock.expects('get').withArgs(path);

    ExploreAPI.getTrending();

    done();
  });

});