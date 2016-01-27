'use strict';

import when                from 'when';

import TrendingGroupsStore from '../../app/js/stores/TrendingGroupsStore';
import GlobalActions       from '../../app/js/actions/GlobalActions';
import GroupAPI            from '../../app/js/utils/GroupAPI';

describe('Store: TrendingGroups', function() {

  it('should load trending groups on action', function(done) {
    const getTrendingStub = sandbox.stub(GroupAPI, 'getTrending').returns(when());

    GlobalActions.loadGroups(() => {
      sinon.assert.calledOnce(getTrendingStub);
      done();
    });
  });

});