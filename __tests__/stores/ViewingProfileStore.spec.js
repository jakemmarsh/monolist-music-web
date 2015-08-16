'use strict';

import ViewingProfileStore from '../../app/js/stores/ViewingProfileStore';
import UserActions         from '../../app/js/actions/UserActions';
import UserAPI             from '../../app/js/utils/UserAPI';

describe('Store: ViewingProfile', function() {

  beforeEach(function() {
    this.userApiMock = sandbox.mock(UserAPI);
  });

  it('should load a user\'s profile on action', function(done) {
    let username = 'test';

    this.userApiMock.expects('get').withArgs(username);

    UserActions.openProfile(username);

    // TODO: test subsequent calls?

    done();
  });

  it('should follow/unfollow a user on action', function(done) {
    let user = { id: 1 };

    this.userApiMock.expects('follow').withArgs(user.id);

    UserActions.follow(user);

    done();
  });

});