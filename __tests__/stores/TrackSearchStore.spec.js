'use strict';

import when             from 'when';

import TrackSearchStore from '../../app/js/stores/TrackSearchStore';
import SearchActions    from '../../app/js/actions/SearchActions';
import SearchAPI        from '../../app/js/utils/SearchAPI';
import Mixpanel         from '../../app/js/utils/Mixpanel';

describe('Store: TrackSearch', function() {

  it('should search tracks on action and log event', function(done) {
    const query = 'test';
    const sources = 'soundcloud,youtube,bandcamp';
    const results = [];
    const searchStub = sandbox.stub(SearchAPI, 'trackSearch').returns(when(results));
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    SearchActions.searchTracks(query, sources, () => {
      sinon.assert.calledOnce(searchStub);
      sinon.assert.calledWith(searchStub, query);
      sinon.assert.calledWith(mixpanelStub, 'search tracks', {
        query: query,
        sources: sources,
        numResults: results.length
      });
      done();
    });
  });

});