'use strict';

import APIUtils from '../../app/js/utils/APIUtils';
import UserAPI  from '../../app/js/utils/UserAPI';

describe('Util: UserAPI', function() {

  beforeEach(function() {
    this.apiUtilsMock = sinon.mock(APIUtils);
  });

  it('should make a request to retrieve a single user', function(done) {
    let identifier = 'jakemmarsh';
    let path = 'user/' + identifier;

    this.apiUtilsMock.expects('post').withArgs(path);

    UserAPI.get(identifier);

    done();
  });

  it('should make a request to update a user', function(done) {
    let userId = 1;
    let path = 'user/' + userId;
    let updates = {};

    this.apiUtilsMock.expects('patch').withArgs(path, updates);

    UserAPI.update(userId, updates);

    done();
  });

  it('should make a request to get a user\'s notifications', function(done) {
    let userId = 1;
    let path = 'user/' + userId + '/notifications';

    this.apiUtilsMock.expects('get').withArgs(path);

    UserAPI.getNotifications(userId);

    done();
  });

  it('should make a request to mark a user\'s notifications as read', function(done) {
    let userId = 1;
    let notificationIds = [1, 2, 3];
    let path = 'user/' + userId + '/notifications/' + notificationIds.join(',') + '/read';

    this.apiUtilsMock.expects('post').withArgs(path);

    UserAPI.markNotificationsAsRead(userId, notificationIds);

    done();
  });

  it('should make a request to update a user', function(done) {
    let userId = 1;
    let path = 'user/' + userId + '/follow';

    this.apiUtilsMock.expects('post').withArgs(path);

    UserAPI.follow(userId);

    done();
  });

  it('should make a request to get a user\'s editable playlists', function(done) {
    let userId = 1;
    let path = 'user/' + userId + '/editable';

    this.apiUtilsMock.expects('get').withArgs(path);

    UserAPI.getEditablePlaylists(userId);

    done();
  });

  it('should make a request to get a user\'s playlists', function(done) {
    let userId = 1;
    let path = 'user/' + userId + '/playlists';

    this.apiUtilsMock.expects('get').withArgs(path);

    UserAPI.getPlaylists(userId);

    done();
  });

  it('should make a request to get a user\'s collaborations', function(done) {
    let userId = 1;
    let path = 'user/' + userId + '/collaborations';

    this.apiUtilsMock.expects('get').withArgs(path);

    UserAPI.getCollaborations(userId);

    done();
  });

  it('should make a request to get a user\'s groups', function(done) {
    let userId = 1;
    let path = 'user/' + userId + '/groups';

    this.apiUtilsMock.expects('get').withArgs(path);

    UserAPI.getGroups(userId);

    done();
  });

  it('should make a request to get a user\'s likes', function(done) {
    let userId = 1;
    let path = 'user/' + userId + '/likes';

    this.apiUtilsMock.expects('get').withArgs(path);

    UserAPI.getLikes(userId);

    done();
  });

  it('should make a request to get a user\'s stars', function(done) {
    let userId = 1;
    let path = 'user/' + userId + '/stars';

    this.apiUtilsMock.expects('get').withArgs(path);

    UserAPI.getStars(userId);

    done();
  });

  afterEach(function() {
    this.apiUtilsMock.restore();
  });

});