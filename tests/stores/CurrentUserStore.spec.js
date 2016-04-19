'use strict';

import CurrentUserStore from '../../app/js/stores/CurrentUserStore';
import UserActions      from '../../app/js/actions/UserActions';
import TrackActions     from '../../app/js/actions/TrackActions';
import GlobalActions    from '../../app/js/actions/GlobalActions';
import AuthAPI          from '../../app/js/utils/AuthAPI';
import UserAPI          from '../../app/js/utils/UserAPI';
import TrackAPI         from '../../app/js/utils/TrackAPI';
import Mixpanel         from '../../app/js/utils/Mixpanel';

describe('Store: CurrentUser', function() {

  it('should trigger and call cb on setUser and log in to Mixpanel', function() {
    const cbStub = sandbox.stub();
    const triggerStub = sandbox.stub(CurrentUserStore, 'trigger');
    const mixpanelStub = sandbox.stub(Mixpanel, 'loginUser');
    const user = {
      id: 1
    };

    CurrentUserStore.user = { id: 2 };
    CurrentUserStore.setUser(user, cbStub);

    sinon.assert.calledWith(mixpanelStub, user);
    sinon.assert.calledOnce(cbStub);
    sinon.assert.calledWith(cbStub, null, user);
    sinon.assert.calledOnce(triggerStub);
    sinon.assert.calledWith(triggerStub, null, user);
  });

  it('should check user\'s login status on action', function(done) {
    const user = { id: 1 };
    const checkStub = sandbox.stub(AuthAPI, 'check').resolves(user);
    const setUserStub = sandbox.stub(CurrentUserStore, 'setUser', (cb) => {
      cb();
    });

    UserActions.check(() => {
      sinon.assert.calledOnce(checkStub);
      sinon.assert.calledOnce(setUserStub);
      done();
    });
  });

  it('should log user in on action', function(done) {
    const user = {
      username: 'test',
      password: 'test'
    };
    const loginStub = sandbox.stub(AuthAPI, 'login').resolves(user);
    const setUserStub = sandbox.stub(CurrentUserStore, 'setUser', (cb) => {
      cb();
    });

    UserActions.login(user, () => {
      sinon.assert.calledOnce(loginStub);
      sinon.assert.calledWith(loginStub, user);
      sinon.assert.calledOnce(setUserStub);
      done();
    });
  });

  it('should log user in via facebook on action', function(done) {
    const user = {
      access_token: 'abcdefg', //eslint-disable-line camelcase
      profile: {}
    };
    const loginStub = sandbox.stub(AuthAPI, 'facebookLogin').resolves({});

    UserActions.facebookLogin(user, () => {
      sinon.assert.calledOnce(loginStub);
      sinon.assert.calledWith(loginStub, user);
      done();
    });
  });

  it('should update a user on action and log event', function(done) {
    const user = {
      id: 1,
      username: 'test'
    };
    const updates = {
      email: 'new@test.com'
    };
    const updateStub = sandbox.stub(UserAPI, 'update').resolves({});
    const mixpanelStub = sandbox.stub(Mixpanel, 'logEvent');

    CurrentUserStore.user = user;

    UserActions.update(updates, () => {
      sinon.assert.calledOnce(updateStub);
      sinon.assert.calledWith(updateStub, user.id, updates);
      sinon.assert.calledWith(mixpanelStub, 'update profile', {
        username: user.username,
        updates: updates
      });
      done();
    });
  });

  it('should star a track on action', function(done) {
    const track = {
      id: 1,
      title: 'test'
    };
    const starStub = sandbox.stub(TrackAPI, 'star').resolves();
    const successIndicatorStub = sandbox.stub(GlobalActions, 'triggerSuccessIndicator');

    CurrentUserStore.user = { starredTracks: [] };

    TrackActions.star(track, () => {
      sinon.assert.calledOnce(starStub);
      sinon.assert.calledWith(starStub, track);
      sinon.assert.calledOnce(successIndicatorStub);
      done();
    });
  });

  it('should unstar a track on action', function(done) {
    const track = {
      id: 1,
      title: 'test'
    };
    const starStub = sandbox.stub(TrackAPI, 'star').resolves();
    const successIndicatorStub = sandbox.stub(GlobalActions, 'triggerSuccessIndicator');

    CurrentUserStore.user = { starredTracks: [] };

    TrackActions.star(track, () => {
      sinon.assert.calledOnce(starStub);
      sinon.assert.calledWith(starStub, track);
      sinon.assert.calledOnce(successIndicatorStub);
      done();
    });
  });

  it('should log user out on action', function(done) {
    const logoutStub = sandbox.stub(AuthAPI, 'logout').resolves();

    UserActions.logout(() => {
      sinon.assert.calledOnce(logoutStub);
      done();
    });
  });

});
