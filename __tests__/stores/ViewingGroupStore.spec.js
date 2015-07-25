'use strict';

var ViewingGroupStore = require('../../app/js/stores/ViewingGroupStore');
var GroupActions      = require('../../app/js/actions/GroupActions');
var GroupAPI          = require('../../app/js/utils/GroupAPI');

describe('Store: ViewingGroup', function() {

  var mock;

  before(function() {
    mock = sinon.mock(GroupAPI);
  });

  it('should load a specific group on action', function(done) {
    var slug = 'test-group';

    mock.expects('get').withArgs(slug);

    GroupActions.open(slug);

    done();
  });

  it('should load a group\'s playlists on action', function(done) {
    var groupId = 1;

    mock.expects('getPlaylists').withArgs(groupId);

    GroupActions.loadPlaylists(groupId);

    done();
  });

  it('should add a member to a group on action', function(done) {
    var groupId = 1;
    var user = { id: 1 };

    mock.expects('addMember').withArgs(groupId, user);

    GroupActions.addMember(groupId, user);

    done();
  });

  it('should remove a member from a group on action', function(done) {
    var groupId = 1;
    var user = { id: 1 };

    mock.expects('removeMember').withArgs(groupId, user);

    GroupActions.removeMember(groupId, user);

    done();
  });

  it('should follow a group on action', function(done) {
    var groupId = 1;

    mock.expects('follow').withArgs(groupId);

    GroupActions.follow(groupId);

    done();
  });

  after(function() {
    mock.restore();
  });

});