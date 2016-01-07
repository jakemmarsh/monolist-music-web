'use strict';

import when                from 'when';

import ViewingProfileStore from '../../app/js/stores/ViewingProfileStore';
import UserActions         from '../../app/js/actions/UserActions';
import UserAPI             from '../../app/js/utils/UserAPI';
import TestHelpers         from '../../utils/testHelpers';

describe('Store: ViewingProfile', function() {

  const user = Object.freeze(TestHelpers.fixtures.user);

  it('should load a user\'s profile on action', function(done) {
    const username = 'test';
    const getStub = sandbox.stub(UserAPI, 'get').returns(when(user));

    UserActions.openProfile(username, () => {
      sinon.assert.calledOnce(getStub);
      sinon.assert.calledWith(getStub, username);
      done();
    });

    // TODO: test subsequent calls?
  });

  it('should follow/unfollow a user on action', function(done) {
    const followStub = sandbox.stub(UserAPI, 'follow').returns(when());

    UserActions.follow(user, () => {
      sinon.assert.calledOnce(followStub);
      sinon.assert.calledWith(followStub, user.id);
      done();
    });
  });

});