'use strict';

import when             from 'when';

import SearchActions     from '../../app/js/actions/SearchActions';
import GroupSearchStore from '../../app/js/stores/GroupSearchStore';
import SearchAPI        from '../../app/js/utils/SearchAPI';

describe('Store: GroupSearch', function() {

  it('should search all groups on action', function(done) {
    const query = 'test';
    const groupSearchStub = sandbox.stub(SearchAPI, 'groupSearch').returns(when());

    SearchActions.searchGroups(query, () => {
      sinon.assert.calledOnce(groupSearchStub);
      sinon.assert.calledWith(groupSearchStub, query);
      done();
    });
  });

});