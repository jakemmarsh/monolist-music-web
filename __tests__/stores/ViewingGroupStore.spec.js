'use strict';

import when              from 'when';

import ViewingGroupStore from '../../app/js/stores/ViewingGroupStore';
import GroupActions      from '../../app/js/actions/GroupActions';
import GroupAPI          from '../../app/js/utils/GroupAPI';

describe('Store: ViewingGroup', function() {

  it('should load a specific group on action', function(done) {
    const slug = 'test-group';
    const getStub = sandbox.stub(GroupAPI, 'get').returns(when());

    GroupActions.open(slug, () => {
      sinon.assert.calledOnce(getStub);
      sinon.assert.calledWith(getStub, slug);
      done();
    });
  });

  it('should load a group\'s playlists on action', function(done) {
    const groupId = 1;
    const getPlaylistsStub = sandbox.stub(GroupAPI, 'getPlaylists').returns(when());

    GroupActions.loadPlaylists(groupId, () => {
      sinon.assert.calledOnce(getPlaylistsStub);
      sinon.assert.calledWith(getPlaylistsStub, groupId);
      done();
    });
  });

  it('should update a group on action', function(done) {
    const groupId = 1;
    const updates = {
      title: 'new title'
    };
    const updateStub = sandbox.stub(GroupAPI, 'update').returns(when());

    GroupActions.update(groupId, updates, () => {
      sinon.assert.calledOnce(updateStub);
      sinon.assert.calledWith(updateStub, groupId, updates);
      done();
    });
  });

  it('should add a member to a group on action', function(done) {
    const groupId = 1;
    const user = { id: 1 };
    const addMemberStub = sandbox.stub(GroupAPI, 'addMember').returns(when());

    GroupActions.addMember(groupId, user, () => {
      sinon.assert.calledOnce(addMemberStub);
      sinon.assert.calledWith(addMemberStub, groupId, user.id);
      done();
    });
  });

  it('should remove a member from a group on action', function(done) {
    const groupId = 1;
    const user = { id: 1 };
    const removeMemberStub = sandbox.stub(GroupAPI, 'removeMember').returns(when());

    GroupActions.removeMember(groupId, user, () => {
      sinon.assert.calledOnce(removeMemberStub);
      sinon.assert.calledWith(removeMemberStub, groupId, user.id);
      done();
    });
  });

  it('should follow a group on action', function(done) {
    const groupId = 1;
    const followStub = sandbox.stub(GroupAPI, 'follow').returns(when());

    GroupActions.follow(groupId, () => {
      sinon.assert.calledOnce(followStub);
      sinon.assert.calledWith(followStub, groupId);
      done();
    });
  });

});