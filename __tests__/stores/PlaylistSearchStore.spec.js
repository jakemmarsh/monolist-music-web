'use strict';

import when                from 'when';

import PlaylistSearchStore from '../../app/js/stores/PlaylistSearchStore';
import SearchActions       from '../../app/js/actions/SearchActions';
import SearchAPI           from '../../app/js/utils/SearchAPI';

describe('Store: PlaylistSearch', function() {

  it('should search playlists on action', function(done) {
    const query = 'test';
    const searchStub = sandbox.stub(SearchAPI, 'playlistSearch').returns(when());

    SearchActions.searchPlaylists(query, () => {
      sinon.assert.calledOnce(searchStub);
      sinon.assert.calledWith(searchStub, query);
      done();
    });
  });

});