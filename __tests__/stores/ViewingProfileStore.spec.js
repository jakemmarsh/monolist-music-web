'use strict';

import when                from 'when';

import ViewingProfileStore from '../../app/js/stores/ViewingProfileStore'; // eslint-disable-line no-unused-vars
import UserActions         from '../../app/js/actions/UserActions';
import UserAPI             from '../../app/js/utils/UserAPI';
import Mixpanel            from '../../app/js/utils/Mixpanel';
import TestHelpers         from '../../utils/testHelpers';

describe('Store: ViewingProfile', function() {

  const PROFILE = Object.freeze(TestHelpers.fixtures.user);

  it('should load a user\'s profile on action', function(done) {
    const username = 'test';
    const getStub = sandbox.stub(UserAPI, 'get').returns(when(PROFILE));
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    UserActions.openProfile(username, () => {
      sinon.assert.calledOnce(getStub);
      sinon.assert.calledWith(getStub, username);
      sinon.assert.calledWith(mixpanelStub, 'view profile', {
        profile: PROFILE
      });
      done();
    });

    // TODO: test subsequent calls?
  });

  it('should follow/unfollow a user on action and log event', function(done) {
    const followStub = sandbox.stub(UserAPI, 'follow').returns(when());
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');
    const currentUser = { id: 5 };

    UserActions.follow(PROFILE, currentUser, () => {
      sinon.assert.calledOnce(followStub);
      sinon.assert.calledWith(followStub, PROFILE.id);
      sinon.assert.calledWith(mixpanelStub, 'follow user', {
        userId: PROFILE.id
      });
      done();
    });
  });

});
