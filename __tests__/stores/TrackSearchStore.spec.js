'use strict';

import when             from 'when';

import TrackSearchStore from '../../app/js/stores/TrackSearchStore';
import SearchActions    from '../../app/js/actions/SearchActions';
import SearchAPI        from '../../app/js/utils/SearchAPI';

describe('Store: TrackSearch', function() {

  it('should search tracks on action', function(done) {
    const query = 'test';
    const sources = 'soundcloud,youtube,bandcamp';
    const searchStub = sandbox.stub(SearchAPI, 'trackSearch').returns(when());

    SearchActions.searchTracks(query, sources, () => {
      sinon.assert.calledOnce(searchStub);
      sinon.assert.calledWith(searchStub, query);
      done();
    });
  });

});