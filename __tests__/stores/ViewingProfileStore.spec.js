'use strict';

var ViewingProfileStore = require('../../app/js/stores/ViewingProfileStore');
var UserActions         = require('../../app/js/actions/UserActions');
var UserAPI             = require('../../app/js/utils/UserAPI');

describe('Store: ViewingProfile', function() {

  var mock;

  before(function() {
    mock = sinon.mock(UserAPI);
  });

  it('should load a user\'s profile on action', function(done) {
    var username = 'test';

    mock.expects('get').withArgs(username);

    UserActions.openProfile(username);

    // TODO: test subsequent calls?

    done();
  });

  it('should follow/unfollow a user on action', function(done) {
    var user = { id: 1 };

    mock.expects('follow').withArgs(user.id);

    UserActions.follow(user);

    done();
  });

  after(function() {
    mock.restore();
  });

});