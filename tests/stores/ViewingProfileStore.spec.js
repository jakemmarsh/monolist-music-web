'use strict';

import ViewingProfileStore from '../../app/js/stores/ViewingProfileStore'; // eslint-disable-line no-unused-vars
import UserActions         from '../../app/js/actions/UserActions';
import UserAPI             from '../../app/js/utils/UserAPI';
import Mixpanel            from '../../app/js/utils/Mixpanel';
import TestHelpers         from '../../utils/testHelpers';

describe('Store: ViewingProfile', function() {

  const PROFILE = Object.freeze(TestHelpers.fixtures.user);

  it('should load a user\'s profile on action', function(done) {
    const username = 'test';

    sandbox.stub(UserAPI, 'get').resolves(PROFILE);
    sandbox.stub(UserAPI, 'getPlaylists').resolves([]);
    sandbox.stub(UserAPI, 'getCollaborations').resolves([]);
    sandbox.stub(UserAPI, 'getGroups').resolves(PROFILE);
    sandbox.stub(UserAPI, 'getLikes').resolves(PROFILE);
    sandbox.stub(UserAPI, 'getStars').resolves(PROFILE);
    sandbox.stub(Mixpanel, 'logEvent');

    UserActions.openProfile(username, () => {
      sinon.assert.calledOnce(UserAPI.get);
      sinon.assert.calledWith(UserAPI.get, username);
      sinon.assert.calledOnce(UserAPI.getPlaylists);
      sinon.assert.calledWith(UserAPI.getPlaylists, PROFILE.id);
      sinon.assert.calledOnce(UserAPI.getCollaborations);
      sinon.assert.calledWith(UserAPI.getCollaborations, PROFILE.id);
      sinon.assert.calledOnce(UserAPI.getGroups);
      sinon.assert.calledWith(UserAPI.getGroups, PROFILE.id);
      sinon.assert.calledOnce(UserAPI.getLikes);
      sinon.assert.calledWith(UserAPI.getLikes, PROFILE.id);
      sinon.assert.calledOnce(UserAPI.getStars);
      sinon.assert.calledWith(UserAPI.getStars, PROFILE.id);
      sinon.assert.calledWith(Mixpanel.logEvent, 'view profile', {
        profile: PROFILE
      });

      done();
    });
  });

  it('should follow/unfollow a user on action and log event', function(done) {
    const currentUser = { id: 5 };

    sandbox.stub(UserAPI, 'follow').resolves();
    sandbox.stub(Mixpanel, 'logEvent');

    UserActions.follow(PROFILE, currentUser, () => {
      sinon.assert.calledOnce(UserAPI.follow);
      sinon.assert.calledWith(UserAPI.follow, PROFILE.id);
      sinon.assert.calledWith(Mixpanel.logEvent, 'follow user', {
        userId: PROFILE.id
      });

      done();
    });
  });

});
