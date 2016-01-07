'use strict';

import when             from 'when';

import UserLikesStore   from '../../app/js/stores/UserLikesStore';
import CurrentUserStore from '../../app/js/stores/CurrentUserStore';
import GlobalActions    from '../../app/js/actions/GlobalActions';
import UserAPI          from '../../app/js/utils/UserAPI';

describe('Store: UserLikes', function() {

  it('should load current user\'s likes on action', function(done) {
    const getLikesStub = sandbox.stub(UserAPI, 'getLikes').returns(when());

    CurrentUserStore.user = { id: 1 };

    GlobalActions.loadUserLikes(() => {
      sinon.assert.calledOnce(getLikesStub);
      sinon.assert.calledWith(getLikesStub, CurrentUserStore.user.id);
      done();
    });
  });

});