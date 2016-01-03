'use strict';

import when              from 'when';

import ViewingGroupStore from '../../app/js/stores/ViewingGroupStore';
import GroupActions      from '../../app/js/actions/GroupActions';
import GroupAPI          from '../../app/js/utils/GroupAPI';

describe('Store: ViewingGroup', function() {

  it('should load a specific group on action', function(done) {
    let slug = 'test-group';

    sandbox.mock(GroupAPI).expects('get').withArgs(slug).returns(when());

    GroupActions.open(slug);

    done();
  });

  it('should load a group\'s playlists on action', function(done) {
    let groupId = 1;

    sandbox.mock(GroupAPI).expects('getPlaylists').withArgs(groupId).returns(when());

    GroupActions.loadPlaylists(groupId);

    done();
  });

  it('should update a group on action', function(done) {
    let groupId = 1;
    let updates = {
      title: 'new title'
    };

    sandbox.mock(GroupAPI).expects('update').withArgs(groupId, updates).returns(when());

    GroupActions.update(groupId, updates);

    done();
  });

  it('should add a member to a group on action', function(done) {
    let groupId = 1;
    let user = { id: 1 };

    sandbox.mock(GroupAPI).expects('addMember').withArgs(groupId, user.id).returns(when());

    GroupActions.addMember(groupId, user);

    done();
  });

  it('should remove a member from a group on action', function(done) {
    let groupId = 1;
    let user = { id: 1 };

    sandbox.mock(GroupAPI).expects('removeMember').withArgs(groupId, user.id).returns(when());

    GroupActions.removeMember(groupId, user);

    done();
  });

  it('should follow a group on action', function(done) {
    let groupId = 1;

    sandbox.mock(GroupAPI).expects('follow').withArgs(groupId).returns(when());

    GroupActions.follow(groupId);

    done();
  });

});