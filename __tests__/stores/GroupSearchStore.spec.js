'use strict';

import when             from 'when';

import GroupSearchStore from '../../app/js/stores/GroupSearchStore';
import SearchActions     from '../../app/js/actions/SearchActions';
import SearchAPI        from '../../app/js/utils/SearchAPI';

describe('Store: GroupSearch', function() {

  it('should search all groups on action', function(done) {
    let query = 'test';

    sandbox.mock(SearchAPI).expects('groupSearch').withArgs(query).returns(when());

    SearchActions.searchGroups(query);

    done();
  });

});