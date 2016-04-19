'use strict';

import SearchActions    from '../../app/js/actions/SearchActions';
import GroupSearchStore from '../../app/js/stores/GroupSearchStore'; // eslint-disable-line no-unused-vars
import SearchAPI        from '../../app/js/utils/SearchAPI';
import Mixpanel         from '../../app/js/utils/Mixpanel';

describe('Store: GroupSearch', function() {

  it('should search all groups on action and log event', function(done) {
    const query = 'test';
    const results = [];
    const groupSearchStub = sandbox.stub(SearchAPI, 'groupSearch').resolves(results);
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    SearchActions.searchGroups(query, () => {
      sinon.assert.calledOnce(groupSearchStub);
      sinon.assert.calledWith(groupSearchStub, query);
      sinon.assert.calledWith(mixpanelStub, 'search groups', {
        query: query,
        numResults: results.length
      });
      done();
    });
  });

});
