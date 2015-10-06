'use strict';

import when             from 'when';

import UserLikesStore   from '../../app/js/stores/UserLikesStore';
import CurrentUserStore from '../../app/js/stores/CurrentUserStore';
import GlobalActions    from '../../app/js/actions/GlobalActions';
import UserAPI          from '../../app/js/utils/UserAPI';

describe('Store: UserLikes', function() {

  beforeEach(function() {
    this.userApiMock = sandbox.mock(UserAPI);
  });

  it('should load current user\'s likes on action', function(done) {
    CurrentUserStore.user = { id: 1 };

    this.userApiMock.expects('getLikes').withArgs(CurrentUserStore.user.id).returns(when());

    GlobalActions.loadUserLikes();

    done();
  });

  afterEach(function() {
    this.userApiMock.restore();
  });

});