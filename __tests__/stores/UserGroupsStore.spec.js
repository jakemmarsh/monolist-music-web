'use strict';

import when                 from 'when';

import TestHelpers          from '../../utils/testHelpers';
import UserGroupsStore      from '../../app/js/stores/UserGroupsStore'; // eslint-disable-line no-unused-vars
import CurrentUserStore     from '../../app/js/stores/CurrentUserStore';
import GlobalActions        from '../../app/js/actions/GlobalActions';
import GroupActions         from '../../app/js/actions/GroupActions';
import UserAPI              from '../../app/js/utils/UserAPI';
import GroupAPI             from '../../app/js/utils/GroupAPI';
import Mixpanel             from '../../app/js/utils/Mixpanel';

describe('Store: UserGroups', function() {

  before(function() {
    CurrentUserStore.user = TestHelpers.fixtures.user;
  });

  it('should load user groups on action', function(done) {
    const getStub = sandbox.stub(UserAPI, 'getGroups').returns(when());

    GlobalActions.loadUserGroups(() => {
      sinon.assert.calledOnce(getStub);
      sinon.assert.calledWith(getStub, TestHelpers.fixtures.user.id);

      done();
    });
  });

  it('should create a new group and log in Mixpanel on action', function(done) {
    const group = {
      id: 1,
      title: 'test'
    };
    const createStub = sandbox.stub(GroupAPI, 'create').returns(when(group));
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    GroupActions.create(group, () => {
      sinon.assert.calledOnce(createStub);
      sinon.assert.calledWith(createStub, group);
      sinon.assert.calledWith(mixpanelStub, 'create group', {
        group: group
      });

      done();
    });
  });

});
