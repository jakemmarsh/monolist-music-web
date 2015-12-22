'use strict';

import when             from 'when';

import UserLikesStore   from '../../app/js/stores/UserLikesStore';
import CurrentUserStore from '../../app/js/stores/CurrentUserStore';
import GlobalActions    from '../../app/js/actions/GlobalActions';
import UserAPI          from '../../app/js/utils/UserAPI';

describe('Store: UserLikes', function() {

  it('should load current user\'s likes on action', function(done) {
    CurrentUserStore.user = { id: 1 };

    sandbox.mock(UserAPI).expects('getLikes').withArgs(CurrentUserStore.user.id).returns(when());

    GlobalActions.loadUserLikes();

    done();
  });

});