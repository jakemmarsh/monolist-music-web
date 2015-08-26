'use strict';

import when             from 'when';

import GroupSearchStore from '../../app/js/stores/GroupSearchStore';
import SearchActions     from '../../app/js/actions/SearchActions';
import SearchAPI        from '../../app/js/utils/SearchAPI';

describe('Store: GroupSearch', function() {

  beforeEach(function() {
    this.searchAPIMock = sandbox.mock(SearchAPI);
  });

  it('should search all groups on action', function(done) {
    let query = 'test';

    this.searchAPIMock.expects('groupSearch').withArgs(query).returns(when());

    SearchActions.searchGroups(query);

    done();
  });

});