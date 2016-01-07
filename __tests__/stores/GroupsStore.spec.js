'use strict';

import when             from 'when';

import GroupsStore      from '../../app/js/stores/GroupsStore';
import CurrentUserStore from '../../app/js/stores/CurrentUserStore';
import GlobalActions    from '../../app/js/actions/GlobalActions';
import UserAPI          from '../../app/js/utils/UserAPI';
import GroupAPI         from '../../app/js/utils/GroupAPI';

describe('Store: Groups', function() {

  it('should load trending groups on action if no user', function(done) {
    const getTrendingStub = sandbox.stub(GroupAPI, 'getTrending').returns(when());

    GlobalActions.loadGroups(() => {
      sinon.assert.calledOnce(getTrendingStub);
      done();
    });
  });

  it('should load trending and user groups on action', function(done) {
    const getTrendingStub = sandbox.stub(GroupAPI, 'getTrending').returns(when());
    const getGroupsStub = sandbox.stub(UserAPI, 'getGroups').returns(when());

    CurrentUserStore.user = {
      id: 1
    };

    GlobalActions.loadGroups(() => {
      sinon.assert.calledOnce(getTrendingStub);
      sinon.assert.calledOnce(getGroupsStub);
      done();
    });
  });

});