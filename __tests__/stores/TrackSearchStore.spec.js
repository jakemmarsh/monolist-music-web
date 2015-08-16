'use strict';

import TrackSearchStore from '../../app/js/stores/TrackSearchStore';
import GlobalActions    from '../../app/js/actions/GlobalActions';
import SearchAPI        from '../../app/js/utils/SearchAPI';

describe('Store: TrackSearch', function() {

  beforeEach(function() {
    this.searchApiMock = sandbox.mock(SearchAPI);
  });

  it('should search tracks on action', function(done) {
    let query = 'test';

    this.searchApiMock.expects('trackSearch').withArgs(query);

    GlobalActions.doTrackSearch(query);

    done();
  });

  afterEach(function() {
    this.searchApiMock.restore();
  });

});