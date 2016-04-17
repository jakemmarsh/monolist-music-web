'use strict';

import TrackSearchStore from '../../app/js/stores/TrackSearchStore'; // eslint-disable-line no-unused-vars
import SearchActions    from '../../app/js/actions/SearchActions';
import SearchAPI        from '../../app/js/utils/SearchAPI';
import Mixpanel         from '../../app/js/utils/Mixpanel';

describe('Store: TrackSearch', function() {

  it('should search tracks on action and log event', function(done) {
    const query = 'test';
    const sources = 'soundcloud,youtube,bandcamp';
    const results = [];
    const searchStub = sandbox.stub(SearchAPI, 'trackSearch').resolves(results);
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
