'use strict';

var UserLikesStore   = require('../../app/js/stores/UserLikesStore');
var CurrentUserStore = require('../../app/js/stores/CurrentUserStore');
var GlobalActions    = require('../../app/js/actions/GlobalActions');
var UserAPI          = require('../../app/js/utils/UserAPI');

describe('Store: UserLikes', function() {

  var mock;

  before(function() {
    mock = sinon.mock(UserAPI);
  });

  it('should load current user\'s likes on action', function(done) {
    CurrentUserStore.user = { id: 1 };

    mock.expects('getLikes').withArgs(CurrentUserStore.user.id);

    GlobalActions.loadUserLikes();

    done();
  });

  after(function() {
    mock.restore();
  });

});