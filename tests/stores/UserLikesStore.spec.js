'use strict';

import UserLikesStore   from '../../app/js/stores/UserLikesStore'; // eslint-disable-line no-unused-vars
import CurrentUserStore from '../../app/js/stores/CurrentUserStore';
import GlobalActions    from '../../app/js/actions/GlobalActions';
import UserAPI          from '../../app/js/utils/UserAPI';

describe('Store: UserLikes', function() {

  it('should load current user\'s likes on action', function(done) {
    const getLikesStub = sandbox.stub(UserAPI, 'getLikes').resolves();

    CurrentUserStore.user = { id: 1 };

    GlobalActions.loadUserLikes(() => {
      sinon.assert.calledOnce(getLikesStub);
      sinon.assert.calledWith(getLikesStub, CurrentUserStore.user.id);
      done();
    });
  });

});
