'use strict';

import when          from 'when';

import ExploreStore  from '../../app/js/stores/ExploreStore';
import GlobalActions from '../../app/js/actions/GlobalActions';
import ExploreAPI    from '../../app/js/utils/ExploreAPI';

describe('Store: Explore', function() {

  beforeEach(function() {
    this.exploreApiMock = sandbox.mock(ExploreAPI);
  });

  it('should load all explore playlists on action', function(done) {
    this.exploreApiMock.expects('getTrending').returns(when());
    this.exploreApiMock.expects('getNewest').returns(when());

    GlobalActions.loadExplorePlaylists();

    done();
  });

});