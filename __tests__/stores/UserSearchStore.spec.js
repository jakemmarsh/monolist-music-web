'use strict';

import when            from 'when';

import UserSearchStore from '../../app/js/stores/UserSearchStore';
import UserActions     from '../../app/js/actions/UserActions';
import SearchAPI       from '../../app/js/utils/SearchAPI';

describe('Store: UserSearch', function() {

  it('should search users on action', function(done) {
    let query = 'test';

    sandbox.mock(SearchAPI).expects('userSearch').withArgs(query).returns(when());

    UserActions.search(query);

    done();
  });

});