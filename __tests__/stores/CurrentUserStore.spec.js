'use strict';

import proxyquire       from 'proxyquire';
import when             from 'when';

import CurrentUserStore from '../../app/js/stores/CurrentUserStore';
import UserActions      from '../../app/js/actions/UserActions';
import TrackActions     from '../../app/js/actions/TrackActions';

const UserAPI = proxyquire('../../app/js/utils/UserAPI', global.requestStub);
const AuthAPI = proxyquire('../../app/js/utils/AuthAPI', global.requestStub);
const TrackAPI = proxyquire('../../app/js/utils/TrackAPI', global.requestStub);

console.log('UserAPI:', UserAPI);

describe('Store: CurrentUser', function() {

  it('should check user\'s login status on action', function(done) {
    sandbox.mock(AuthAPI).expects('check').returns(when({}));

    UserActions.check();

    done();
  });

  it('should log user in on action', function(done) {
    let user = {
      username: 'test',
      password: 'test'
    };

    sandbox.mock(AuthAPI).expects('login').withArgs(user).returns(when({}));

    UserActions.login(user);

    done();
  });

  it('should log user in via facebook on action', function(done) {
    let user = {
      access_token: 'abcdefg', //eslint-disable-line camelcase
      profile: {}
    };

    sandbox.mock(AuthAPI).expects('facebookLogin').withArgs(user).returns(when({}));

    UserActions.facebookLogin(user);

    done();
  });

  it('should update a user on action', function(done) {
    let user = {
      id: 1
    };
    let updates = {
      email: 'new@test.com'
    };

    sandbox.mock(UserAPI).expects('update').withArgs(user.id, updates).returns(when({}));

    CurrentUserStore.user = user;
    UserActions.update(updates);

    done();
  });

  it('should star a track on action', function(done) {
    let track = {
      id: 1,
      title: 'test'
    };

    CurrentUserStore.user = { starredTracks: [] };
    sandbox.mock(TrackAPI).expects('star').withArgs(track).returns(when());

    TrackActions.star(track);

    done();
  });

  it('should unstar a track on action', function(done) {
    let track = {
      id: 1,
      title: 'test'
    };

    CurrentUserStore.user = { starredTracks: [] };
    sandbox.mock(TrackAPI).expects('star').withArgs(track).returns(when());

    TrackActions.star(track);

    done();
  });

  it('should log user out on action', function(done) {
    sandbox.mock(AuthAPI).expects('logout').once().returns(when());

    UserActions.logout();

    done();
  });

});