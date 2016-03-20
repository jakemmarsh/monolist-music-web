'use strict';

import when                from 'when';

import PlaylistSearchStore from '../../app/js/stores/PlaylistSearchStore'; // eslint-disable-line no-unused-vars
import SearchActions       from '../../app/js/actions/SearchActions';
import SearchAPI           from '../../app/js/utils/SearchAPI';
import Mixpanel            from '../../app/js/utils/Mixpanel';

describe('Store: PlaylistSearch', function() {

  it('should search playlists on action and log event', function(done) {
    const query = 'test';
    const results = [];
    const searchStub = sandbox.stub(SearchAPI, 'playlistSearch').returns(when(results));
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    SearchActions.searchPlaylists(query, () => {
      sinon.assert.calledOnce(searchStub);
      sinon.assert.calledWith(searchStub, query);
      sinon.assert.calledWith(mixpanelStub, 'search playlists', {
        query: query,
        numResults: results.length
      });
      done();
    });
  });

});
