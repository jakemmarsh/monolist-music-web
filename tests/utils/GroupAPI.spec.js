'use strict';

import APIUtils    from '../../app/js/utils/APIUtils';
import GroupAPI    from '../../app/js/utils/GroupAPI';
import TestHelpers from '../../utils/testHelpers';

describe('Util: GroupAPI', function() {

  const group = TestHelpers.fixtures.group;
  const user = TestHelpers.fixtures.user;

  beforeEach(function() {
    this.apiUtilsMock = sandbox.mock(APIUtils);
  });

  it('should make a request to get a specific group by slug', function() {
    const path = 'group/' + group.slug;

    this.apiUtilsMock.expects('get').withArgs(path);

    GroupAPI.get(group.slug);
  });

  it('should make a request to create a new group', function() {
    const path = 'group';
    const newGroup = {};

    this.apiUtilsMock.expects('post').withArgs(path, newGroup);

    GroupAPI.create(newGroup);
  });

  it('should make a request to get playlists for a group', function() {
    const path = 'group/' + group.id + '/playlists';

    this.apiUtilsMock.expects('get').withArgs(path);

    GroupAPI.getPlaylists(group.id);
  });

  it('should make a request to get trending groups', function() {
    const path = 'groups/trending';

    this.apiUtilsMock.expects('get').withArgs(path);

    GroupAPI.getTrending();
  });

  it('should make a request to update a group', function() {
    const path = 'group/' + group.id;
    const updates = {};

    this.apiUtilsMock.expects('patch').withArgs(path, updates);

    GroupAPI.update(group.id, updates);
  });

  it('should make a request to add a member to a group', function() {
    const path = 'group/' + group.id + '/member/' + user.id;

    this.apiUtilsMock.expects('post').withArgs(path);

    GroupAPI.addMember(group.id, user.id);
  });

  it('should make a request to remove a member from a group', function() {
    const path = 'group/' + group.id + '/member/' + user.id;

    this.apiUtilsMock.expects('del').withArgs(path);

    GroupAPI.removeMember(group.id, user.id);
  });

  it('should make a request to update a member\'s level', function() {
    const newLevel = 2;
    const path = 'group/' + group.id + '/member/' + user.id + '/level/' + newLevel;

    this.apiUtilsMock.expects('post').withArgs(path);

    GroupAPI.updateMemberLevel(group.id, user.id, newLevel);
  });

  it('should make a request to follow a group', function() {
    const path = 'group/' + group.id + '/follow';

    this.apiUtilsMock.expects('post').withArgs(path);

    GroupAPI.follow(group.id);
  });

  it('should make a request to delete a group', function() {
    const path = `group/${group.id}`;

    this.apiUtilsMock.expects('del').withArgs(path);

    GroupAPI.delete(group.id);
  });

});
