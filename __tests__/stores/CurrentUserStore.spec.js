'use strict';

var CurrentUserStore = require('../../app/js/stores/CurrentUserStore');
var UserActions      = require('../../app/js/actions/UserActions');
var TrackActions     = require('../../app/js/actions/TrackActions');
var UserAPI          = require('../../app/js/utils/UserAPI');
var AuthAPI          = require('../../app/js/utils/AuthAPI');
var TrackAPI         = require('../../app/js/utils/TrackAPI');

describe('Store: CurrentUser', function() {

  var userAPIMock;
  var authAPIMock;
  var trackAPIMock;

  before(function() {
    userAPIMock = sinon.mock(UserAPI);
    authAPIMock = sinon.mock(AuthAPI);
    trackAPIMock = sinon.mock(TrackAPI);
  });

  it('should be empty on init', function(done) {
    /* eslint-disable */
    (CurrentUserStore.user === null).should.be.true;
    /* eslint-enable */
    done();
  });

  it('should check user\'s login status on action', function(done) {
    authAPIMock.expects('check');

    UserActions.check();

    done();
  });

  it('should log user in on action', function(done) {
    var user = {
      username: 'test',
      password: 'test'
    };

    authAPIMock.expects('login').withArgs(user);

    UserActions.login(user);

    done();
  });

  it('should log user in via facebook on action', function(done) {
    var user = {
      access_token: 'abcdefg',
      profile: {}
    };

    authAPIMock.expects('facebookLogin').withArgs(user);

    UserActions.facebookLogin(user);

    done();
  });

  it('should update a user on action', function(done) {
    var userId = 1;
    var updates = {
      email: 'new@test.com'
    };

    userAPIMock.expects('update').withArgs(userId, updates);

    CurrentUserStore.user.id = userId;
    UserActions.update(updates);

    done();
  });

  it('should star a track on action', function(done) {
    var track = {
      id: 1,
      title: 'test'
    };

    trackAPIMock.expects('star').withArgs(track);

    TrackActions.star(track);

    done();
  });

  it('should unstar a track on action', function(done) {
    var track = {
      id: 1,
      title: 'test'
    };

    trackAPIMock.expects('star').withArgs(track);

    TrackActions.star(track);

    done();
  });

  it('should log user out on action', function(done) {
    authAPIMock.expects('logout');

    UserActions.logout();

    done();
  });

  after(function() {
    userAPIMock.restore();
    authAPIMock.restore();
    trackAPIMock.restore();
  });

});