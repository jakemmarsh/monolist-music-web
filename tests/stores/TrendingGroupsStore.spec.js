'use strict';

import TrendingGroupsStore from '../../app/js/stores/TrendingGroupsStore'; // eslint-disable-line no-unused-vars
import GlobalActions       from '../../app/js/actions/GlobalActions';
import GroupAPI            from '../../app/js/utils/GroupAPI';

describe('Store: TrendingGroups', function() {

  it('should load trending groups on action', function(done) {
    const getTrendingStub = sandbox.stub(GroupAPI, 'getTrending').resolves();

    GlobalActions.loadGroups(() => {
      sinon.assert.calledOnce(getTrendingStub);
      done();
    });
  });

});
