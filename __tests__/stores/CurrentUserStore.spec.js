'use strict';

import when             from 'when';

import CurrentUserStore from '../../app/js/stores/CurrentUserStore';
import UserActions      from '../../app/js/actions/UserActions';
import TrackActions     from '../../app/js/actions/TrackActions';
import AuthAPI          from '../../app/js/utils/AuthAPI';
import UserAPI          from '../../app/js/utils/UserAPI';
import TrackAPI         from '../../app/js/utils/TrackAPI';

describe('Store: CurrentUser', function() {

  it('should check user\'s login status on action', function(done) {
    const checkStub = sandbox.stub(AuthAPI, 'check').returns(when({}));

    UserActions.check(() => {
      sinon.assert.calledOnce(checkStub);
      done();
    });
  });

  it('should log user in on action', function(done) {
    const user = {
      username: 'test',
      password: 'test'
    };
    const loginStub = sandbox.stub(AuthAPI, 'login').returns(when({}));

    UserActions.login(user, () => {
      sinon.assert.calledOnce(loginStub);
      sinon.assert.calledWith(loginStub, user);
      done();
    });
  });

  it('should log user in via facebook on action', function(done) {
    const user = {
      access_token: 'abcdefg', //eslint-disable-line camelcase
      profile: {}
    };
    const loginStub = sandbox.stub(AuthAPI, 'facebookLogin').returns(when({}));

    UserActions.facebookLogin(user, () => {
      sinon.assert.calledOnce(loginStub);
      sinon.assert.calledWith(loginStub, user);
      done();
    });
  });

  it('should update a user on action', function(done) {
    const user = {
      id: 1
    };
    const updates = {
      email: 'new@test.com'
    };
    const updateStub = sandbox.stub(UserAPI, 'update').returns(when({}));

    CurrentUserStore.user = user;

    UserActions.update(updates, () => {
      sinon.assert.calledOnce(updateStub);
      sinon.assert.calledWith(updateStub, user.id, updates);
      done();
    });
  });

  it('should star a track on action', function(done) {
    const track = {
      id: 1,
      title: 'test'
    };
    const starStub = sandbox.stub(TrackAPI, 'star').returns(when());

    CurrentUserStore.user = { starredTracks: [] };

    TrackActions.star(track, () => {
      sinon.assert.calledOnce(starStub);
      sinon.assert.calledWith(starStub, track);
      done();
    });
  });

  it('should unstar a track on action', function(done) {
    const track = {
      id: 1,
      title: 'test'
    };
    const starStub = sandbox.stub(TrackAPI, 'star').returns(when());

    CurrentUserStore.user = { starredTracks: [] };

    TrackActions.star(track, () => {
      sinon.assert.calledOnce(starStub);
      sinon.assert.calledWith(starStub, track);
      done();
    });
  });

  it('should log user out on action', function(done) {
    const logoutStub = sandbox.stub(AuthAPI, 'logout').returns(when());

    UserActions.logout(() => {
      sinon.assert.calledOnce(logoutStub);
      done();
    });
  });

});