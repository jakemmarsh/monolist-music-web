'use strict';

import ViewingGroupStore from '../../app/js/stores/ViewingGroupStore'; // eslint-disable-line no-unused-vars
import GlobalActions     from '../../app/js/actions/GlobalActions';
import GroupActions      from '../../app/js/actions/GroupActions';
import GroupAPI          from '../../app/js/utils/GroupAPI';
import TestHelpers       from '../../utils/testHelpers';
import Mixpanel          from '../../app/js/utils/Mixpanel';

describe('Store: ViewingGroup', function() {

  const group = TestHelpers.fixtures.group;

  it('should load a specific group on action', function(done) {
    const getStub = sandbox.stub(GroupAPI, 'get').resolves(group);
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
    const getPlaylistsStub = sandbox.stub(GroupAPI, 'getPlaylists').resolves();

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
    const updateStub = sandbox.stub(GroupAPI, 'update').resolves();
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
    const addMemberStub = sandbox.stub(GroupAPI, 'addMember').resolves();
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
    const removeMemberStub = sandbox.stub(GroupAPI, 'removeMember').resolves();
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
    const user = { id: 1 };
    const followStub = sandbox.stub(GroupAPI, 'follow').resolves();
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    GroupActions.follow(group.id, user, () => {
      sinon.assert.calledOnce(followStub);
      sinon.assert.calledWith(followStub, group.id);
      sinon.assert.calledWith(mixpanelStub, 'follow group', {
        groupId: group.id
      });
      done();
    });
  });

  it('should delete a group on action', function(done) {
    sandbox.stub(GroupAPI, 'delete').resolves();
    sandbox.stub(Mixpanel, 'logEvent');
    sandbox.stub(GlobalActions, 'triggerSuccessIndicator');

    GroupActions.delete(group, () => {
      sinon.assert.calledOnce(GroupAPI.delete);
      sinon.assert.calledWith(GroupAPI.delete, group.id);
      sinon.assert.calledWith(Mixpanel.logEvent, 'delete group', {
        group: group
      });
      sinon.assert.calledOnce(GlobalActions.triggerSuccessIndicator);
      done();
    });
  });

});
