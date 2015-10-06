'use strict';

import when              from 'when';

import ViewingGroupStore from '../../app/js/stores/ViewingGroupStore';
import GroupActions      from '../../app/js/actions/GroupActions';
import GroupAPI          from '../../app/js/utils/GroupAPI';

describe('Store: ViewingGroup', function() {

  beforeEach(function() {
    this.groupApiMock = sandbox.mock(GroupAPI);
  });

  it('should load a specific group on action', function(done) {
    let slug = 'test-group';

    this.groupApiMock.expects('get').withArgs(slug).returns(when());

    GroupActions.open(slug);

    done();
  });

  it('should load a group\'s playlists on action', function(done) {
    let groupId = 1;

    this.groupApiMock.expects('getPlaylists').withArgs(groupId).returns(when());

    GroupActions.loadPlaylists(groupId);

    done();
  });

  it('should update a group on action', function() {
    let groupId = 1;
    let updates = {
      title: 'new title'
    };

    this.groupApiMock.expects('update').withArgs(groupId, updates).returns(when());

    GroupActions.update(groupId, updates);
  });

  it('should add a member to a group on action', function(done) {
    let groupId = 1;
    let user = { id: 1 };

    this.groupApiMock.expects('addMember').withArgs(groupId, user.id).returns(when());

    GroupActions.addMember(groupId, user);

    done();
  });

  it('should remove a member from a group on action', function(done) {
    let groupId = 1;
    let user = { id: 1 };

    this.groupApiMock.expects('removeMember').withArgs(groupId, user).returns(when());

    GroupActions.removeMember(groupId, user);

    done();
  });

  it('should follow a group on action', function(done) {
    let groupId = 1;

    this.groupApiMock.expects('follow').withArgs(groupId).returns(when());

    GroupActions.follow(groupId);

    done();
  });

  afterEach(function() {
    this.groupApiMock.restore();
  });

});