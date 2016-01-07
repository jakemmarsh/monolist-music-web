'use strict';

import when                       from 'when';

import ViewingRecentSearchesStore from '../../app/js/stores/ViewingRecentSearchesStore';
import GlobalActions              from '../../app/js/actions/GlobalActions';
import PlaylistAPI                from '../../app/js/utils/PlaylistAPI';

describe('Store: ViewingRecentSearches', function() {

  it('should load recent playlist searches on action', function(done) {
    const getRecentSearchesStub = sandbox.stub(PlaylistAPI, 'getRecentSearches').returns(when());

    GlobalActions.loadExploreSearches(() => {
      sinon.assert.calledOnce(getRecentSearchesStub);
      done();
    });
  });

});