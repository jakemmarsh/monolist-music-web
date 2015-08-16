'use strict';

import when             from 'when';

import CurrentUserStore from '../../app/js/stores/CurrentUserStore';
import UserActions      from '../../app/js/actions/UserActions';
import TrackActions     from '../../app/js/actions/TrackActions';
import UserAPI          from '../../app/js/utils/UserAPI';
import AuthAPI          from '../../app/js/utils/AuthAPI';
import TrackAPI         from '../../app/js/utils/TrackAPI';

describe('Store: CurrentUser', function() {


  beforeEach(function() {
    this.userAPIMock = sinon.mock(UserAPI);
    this.authAPIMock = sinon.mock(AuthAPI);
    this.trackAPIMock = sinon.mock(TrackAPI);
  });

  it('should be empty on init', function(done) {
    /* eslint-disable */
    (CurrentUserStore.user === null).should.be.true;
    /* eslint-enable */
    done();
  });

  it('should check user\'s login status on action', function(done) {
    this.authAPIMock.expects('check').returns(when());

    UserActions.check();

    done();
  });

  it('should log user in on action', function(done) {
    let user = {
      username: 'test',
      password: 'test'
    };

    this.authAPIMock.expects('login').withArgs(user);

    UserActions.login(user);

    done();
  });

  it('should log user in via facebook on action', function(done) {
    let user = {
      access_token: 'abcdefg',
      profile: {}
    };

    this.authAPIMock.expects('facebookLogin').withArgs(user);

    UserActions.facebookLogin(user);

    done();
  });

  it('should update a user on action', function(done) {
    let userId = 1;
    let updates = {
      email: 'new@test.com'
    };

    this.userAPIMock.expects('update').withArgs(userId, updates);

    CurrentUserStore.user.id = userId;
    UserActions.update(updates);

    done();
  });

  it('should star a track on action', function(done) {
    let track = {
      id: 1,
      title: 'test'
    };

    this.trackAPIMock.expects('star').withArgs(track);

    TrackActions.star(track);

    done();
  });

  it('should unstar a track on action', function(done) {
    let track = {
      id: 1,
      title: 'test'
    };

    this.trackAPIMock.expects('star').withArgs(track);

    TrackActions.star(track);

    done();
  });

  it('should log user out on action', function(done) {
    this.authAPIMock.expects('logout');

    UserActions.logout();

    done();
  });

  afterEach(function() {
    this.userAPIMock.restore();
    this.authAPIMock.restore();
    this.trackAPIMock.restore();
  });

});