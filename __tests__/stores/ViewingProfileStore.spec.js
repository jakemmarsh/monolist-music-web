'use strict';

import when                from 'when';

import ViewingProfileStore from '../../app/js/stores/ViewingProfileStore';
import UserActions         from '../../app/js/actions/UserActions';
import UserAPI             from '../../app/js/utils/UserAPI';
import TestHelpers         from '../../utils/testHelpers';

describe('Store: ViewingProfile', function() {

  const user = Object.freeze(TestHelpers.fixtures.user);

  beforeEach(function() {
    this.userApiMock = sandbox.mock(UserAPI);
  });

  it('should load a user\'s profile on action', function(done) {
    let username = 'test';

    this.userApiMock.expects('get').withArgs(username).returns(when(user));

    UserActions.openProfile(username);

    // TODO: test subsequent calls?

    done();
  });

  it('should follow/unfollow a user on action', function(done) {
    this.userApiMock.expects('follow').withArgs(user.id).returns(when());

    UserActions.follow(user);

    done();
  });

});