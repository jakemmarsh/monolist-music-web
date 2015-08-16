'use strict';

import UserSearchStore from '../../app/js/stores/UserSearchStore';
import UserActions     from '../../app/js/actions/UserActions';
import SearchAPI       from '../../app/js/utils/SearchAPI';

describe('Store: UserSearch', function() {

  beforeEach(function() {
    this.searchApiMock = sandbox.mock(SearchAPI);
  });

  it('should search users on action', function(done) {
    let query = 'test';

    this.searchApiMock.expects('userSearch').withArgs(query);

    UserActions.search(query);

    done();
  });

  afterEach(function() {
    this.searchApiMock.restore();
  });

});