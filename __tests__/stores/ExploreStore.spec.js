'use strict';

import ExploreStore  from '../../app/js/stores/ExploreStore';
import GlobalActions from '../../app/js/actions/GlobalActions';
import ExploreAPI    from '../../app/js/utils/ExploreAPI';

describe('Store: Explore', function() {

  beforeEach(function() {
    this.exploreApiMock = sinon.mock(ExploreAPI);
  });

  it('should load all explore playlists on action', function(done) {
    this.exploreApiMock.expects('getTrending');
    this.exploreApiMock.expects('getNewest');

    GlobalActions.loadExplorePlaylists();

    done();
  });

  afterEach(function() {
    this.exploreApiMock.restore();
  });

});