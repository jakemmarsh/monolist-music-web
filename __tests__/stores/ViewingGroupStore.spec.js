'use strict';

import when              from 'when';

import ViewingGroupStore from '../../app/js/stores/ViewingGroupStore'; // eslint-disable-line no-unused-vars
import GroupActions      from '../../app/js/actions/GroupActions';
import GroupAPI          from '../../app/js/utils/GroupAPI';
import TestHelpers       from '../../utils/testHelpers';
import Mixpanel          from '../../app/js/utils/Mixpanel';

describe('Store: ViewingGroup', function() {

  const group = TestHelpers.fixtures.group;

  it('should load a specific group on action', function(done) {
    const getStub = sandbox.stub(GroupAPI, 'get').returns(when(group));
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    GroupActions.open(group.slug, () => {
      sinon.assert.calledOnce(getStub);
      sinon.assert.calledWith(getStub, group.slug);
      sinon.assert.calledWith(mixpanelStub, 'view group', {
        group: group
      });
      done();
    });
  });

  it('should load a group\'s playlists on action', function(done) {
    const getPlaylistsStub = sandbox.stub(GroupAPI, 'getPlaylists').returns(when());

    GroupActions.loadPlaylists(group.id, () => {
      sinon.assert.calledOnce(getPlaylistsStub);
      sinon.assert.calledWith(getPlaylistsStub, group.id);
      done();
    });
  });

  it('should update a group on action', function(done) {
    const updates = {
      title: 'new title'
    };
    const updateStub = sandbox.stub(GroupAPI, 'update').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    GroupActions.update(group.id, updates, () => {
      sinon.assert.calledOnce(updateStub);
      sinon.assert.calledWith(updateStub, group.id, updates);
      sinon.assert.calledWith(mixpanelStub, 'update group', {
        groupId: group.id,
        updates: updates
      });
      done();
    });
  });

  it('should add a member to a group on action', function(done) {
    const user = { id: 1 };
    const addMemberStub = sandbox.stub(GroupAPI, 'addMember').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    GroupActions.addMember(group.id, user, () => {
      sinon.assert.calledOnce(addMemberStub);
      sinon.assert.calledWith(addMemberStub, group.id, user.id);
      sinon.assert.calledWith(mixpanelStub, 'add group member', {
        groupId: group.id,
        userId: user.id
      });
      done();
    });
  });

  it('should remove a member from a group on action', function(done) {
    const user = { id: 1 };
    const removeMemberStub = sandbox.stub(GroupAPI, 'removeMember').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    GroupActions.removeMember(group.id, user, () => {
      sinon.assert.calledOnce(removeMemberStub);
      sinon.assert.calledWith(removeMemberStub, group.id, user.id);
      sinon.assert.calledWith(mixpanelStub, 'remove group member', {
        groupId: group.id,
        userId: user.id
      });
      done();
    });
  });

  it('should follow a group on action', function(done) {
    const followStub = sandbox.stub(GroupAPI, 'follow').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    GroupActions.follow(group.id, () => {
      sinon.assert.calledOnce(followStub);
      sinon.assert.calledWith(followStub, group.id);
      sinon.assert.calledWith(mixpanelStub, 'follow group', {
        groupId: group.id
      });
      done();
    });
  });

});
