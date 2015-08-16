'use strict';

import ViewingGroupStore from '../../app/js/stores/ViewingGroupStore';
import GroupActions      from '../../app/js/actions/GroupActions';
import GroupAPI          from '../../app/js/utils/GroupAPI';

describe('Store: ViewingGroup', function() {

  beforeEach(function() {
    this.groupApiMock = sandbox.mock(GroupAPI);
  });

  it('should load a specific group on action', function(done) {
    let slug = 'test-group';

    this.groupApiMock.expects('get').withArgs(slug);

    GroupActions.open(slug);

    done();
  });

  it('should load a group\'s playlists on action', function(done) {
    let groupId = 1;

    this.groupApiMock.expects('getPlaylists').withArgs(groupId);

    GroupActions.loadPlaylists(groupId);

    done();
  });

  it('should add a member to a group on action', function(done) {
    let groupId = 1;
    let user = { id: 1 };

    this.groupApiMock.expects('addMember').withArgs(groupId, user);

    GroupActions.addMember(groupId, user);

    done();
  });

  it('should remove a member from a group on action', function(done) {
    let groupId = 1;
    let user = { id: 1 };

    this.groupApiMock.expects('removeMember').withArgs(groupId, user);

    GroupActions.removeMember(groupId, user);

    done();
  });

  it('should follow a group on action', function(done) {
    let groupId = 1;

    this.groupApiMock.expects('follow').withArgs(groupId);

    GroupActions.follow(groupId);

    done();
  });

  afterEach(function() {
    this.groupApiMock.restore();
  });

});