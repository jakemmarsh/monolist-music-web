'use strict';

import when             from 'when';

import CurrentUserStore from '../../app/js/stores/CurrentUserStore';
import UserActions      from '../../app/js/actions/UserActions';
import TrackActions     from '../../app/js/actions/TrackActions';
import UserAPI          from '../../app/js/utils/UserAPI';
import AuthAPI          from '../../app/js/utils/AuthAPI';
import TrackAPI         from '../../app/js/utils/TrackAPI';

describe('Store: CurrentUser', function() {

  it('should check user\'s login status on action', function() {
    sandbox.mock(AuthAPI).expects('check').returns(when({}));

    UserActions.check();
  });

  it('should log user in on action', function() {
    let user = {
      username: 'test',
      password: 'test'
    };

    sandbox.mock(AuthAPI).expects('login').withArgs(user).returns(when({}));

    UserActions.login(user);
  });

  it('should log user in via facebook on action', function() {
    let user = {
      access_token: 'abcdefg', //eslint-disable-line camelcase
      profile: {}
    };

    sandbox.mock(AuthAPI).expects('facebookLogin').withArgs(user).returns(when({}));

    UserActions.facebookLogin(user);
  });

  it('should update a user on action', function() {
    let user = {
      id: 1
    };
    let updates = {
      email: 'new@test.com'
    };

    sandbox.mock(UserAPI).expects('update').withArgs(user.id, updates).returns(when({}));

    CurrentUserStore.user = user;
    UserActions.update(updates);
  });

  it('should star a track on action', function() {
    let track = {
      id: 1,
      title: 'test'
    };

    CurrentUserStore.user = { starredTracks: [] };
    sandbox.mock(TrackAPI).expects('star').withArgs(track).returns(when());

    TrackActions.star(track);
  });

  it('should unstar a track on action', function() {
    let track = {
      id: 1,
      title: 'test'
    };

    CurrentUserStore.user = { starredTracks: [] };
    sandbox.mock(TrackAPI).expects('star').withArgs(track).returns(when());

    TrackActions.star(track);
  });

  it('should log user out on action', function() {
    sandbox.mock(AuthAPI).expects('logout').once().returns(when());

    UserActions.logout();
  });

});