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

    sandbox.stub(AuthAPI, 'facebookLogin').resolves({});

    sandbox.stub(CurrentUserStore, 'trigger', () => {
      sinon.assert.calledOnce(AuthAPI.facebookLogin);
      sinon.assert.calledWith(AuthAPI.facebookLogin, user);
      done();
    });

    UserActions.facebookLogin(user);
  });

  it('should update a user on action and log event', function(done) {
    const user = {
      id: 1,
      username: 'test'
    };
    const updates = {
      email: 'new@test.com'
    };

    sandbox.stub(UserAPI, 'update').resolves({});
    sandbox.stub(Mixpanel, 'logEvent');

    CurrentUserStore.user = user;
    sandbox.stub(CurrentUserStore, 'trigger', () => {
      sinon.assert.calledOnce(UserAPI.update);
      sinon.assert.calledWith(UserAPI.update, user.id, updates);
      sinon.assert.calledWith(Mixpanel.logEvent, 'update profile', {
        username: user.username,
        updates: updates
      });
      done();
    });

    UserActions.update(updates);
  });

  it('should star a track on action', function(done) {
    const track = {
      id: 1,
      title: 'test'
    };

    sandbox.stub(TrackAPI, 'star').resolves();
    sandbox.stub(GlobalActions, 'triggerSuccessIndicator');

    CurrentUserStore.user = { starredTracks: [] };
    sandbox.stub(CurrentUserStore, 'trigger', () => {
      sinon.assert.calledOnce(TrackAPI.star);
      sinon.assert.calledWith(TrackAPI.star, track);
      sinon.assert.calledOnce(GlobalActions.triggerSuccessIndicator);
      done();
    });

    TrackActions.star(track);
  });

  it('should unstar a track on action', function(done) {
    const track = {
      id: 1,
      title: 'test'
    };

    sandbox.stub(TrackAPI, 'star').resolves();
    sandbox.stub(GlobalActions, 'triggerSuccessIndicator');

    CurrentUserStore.user = { starredTracks: [] };
    sandbox.stub(CurrentUserStore, 'trigger', () => {
      sinon.assert.calledOnce(TrackAPI.star);
      sinon.assert.calledWith(TrackAPI.star, track);
      sinon.assert.calledOnce(GlobalActions.triggerSuccessIndicator);
      done();
    });

    TrackActions.star(track);
  });

  it('should log user out on action', function(done) {
    const logoutStub = sandbox.stub(AuthAPI, 'logout').resolves();

    UserActions.logout(() => {
      sinon.assert.calledOnce(logoutStub);
      done();
    });
  });

});
