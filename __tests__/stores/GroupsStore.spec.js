'use strict';

import GroupsStore      from '../../app/js/stores/GroupsStore';
import CurrentUserStore from '../../app/js/stores/CurrentUserStore';
import GlobalActions    from '../../app/js/actions/GlobalActions';
import GroupActions     from '../../app/js/actions/GroupActions';
import UserAPI          from '../../app/js/utils/UserAPI';
import GroupAPI         from '../../app/js/utils/GroupAPI';
import SearchAPI        from '../../app/js/utils/SearchAPI';

describe('Store: Groups', function() {

  beforeEach(function() {
    this.userAPIMock = sandbox.mock(UserAPI);
    this.groupAPIMock = sandbox.mock(GroupAPI);
    this.searchAPIMock = sandbox.mock(SearchAPI);
  });

  it('should load trending groups on action if no user', function(done) {
    this.groupAPIMock.expects('getTrending');

    GlobalActions.loadGroups();

    done();
  });

  it('should load trending and user groups on action', function(done) {
    CurrentUserStore.user = {
      id: 1
    };

    this.groupAPIMock.expects('getTrending');
    this.userAPIMock.expects('getGroups').withArgs(CurrentUserStore.user.id);

    GlobalActions.loadGroups();

    done();
  });

  it('should search all groups on action', function(done) {
    let query = 'test';

    this.searchAPIMock.expects('groupSearch').withArgs(query);

    GroupActions.search(query);

    done();
  });

  afterEach(function() {
    this.userAPIMock.restore();
    this.groupAPIMock.restore();
    this.searchAPIMock.restore();
  });

});