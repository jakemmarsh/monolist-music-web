'use strict';

var APIUtils = require('../../app/js/utils/APIUtils');
var UserAPI = require('../../app/js/utils/UserAPI');

describe('Util: UserAPI', function() {

  var mock;

  before(function() {
    mock = sinon.mock(APIUtils);
  });

  it('should make a request to retrieve a single user', function(done) {
    var identifier = 'jakemmarsh';
    var path = 'user/' + identifier;
    var track = {};

    mock.expects('post').withArgs(path);

    UserAPI.get(identifier);

    done();
  });

  it('should make a request to update a user', function(done) {
    var userId = 1;
    var path = 'user/' + userId;
    var updates = {};

    mock.expects('patch').withArgs(path, updates);

    UserAPI.update(userId, updates);

    done();
  });

  it('should make a request to get a user\'s notifications', function(done) {
    var userId = 1;
    var path = 'user/' + userId + '/notifications';

    mock.expects('get').withArgs(path);

    UserAPI.getNotifications(userId);

    done();
  });

  it('should make a request to mark a user\'s notifications as read', function(done) {
    var userId = 1;
    var notificationIds = [1, 2, 3];
    var path = 'user/' + userId + '/notifications/' + notificationIds.join(',') + '/read';

    mock.expects('post').withArgs(path);

    UserAPI.markNotificationsAsRead(userId, notificationIds);

    done();
  });

  it('should make a request to update a user', function(done) {
    var userId = 1;
    var path = 'user/' + userId + '/follow';

    mock.expects('post').withArgs(path);

    UserAPI.follow(userId);

    done();
  });

  it('should make a request to get a user\'s editable playlists', function(done) {
    var userId = 1;
    var path = 'user/' + userId + '/editable';

    mock.expects('get').withArgs(path);

    UserAPI.getEditablePlaylists(userId);

    done();
  });

  it('should make a request to get a user\'s playlists', function(done) {
    var userId = 1;
    var path = 'user/' + userId + '/playlists';

    mock.expects('get').withArgs(path);

    UserAPI.getPlaylists(userId);

    done();
  });

  it('should make a request to get a user\'s collaborations', function(done) {
    var userId = 1;
    var path = 'user/' + userId + '/collaborations';

    mock.expects('get').withArgs(path);

    UserAPI.getCollaborations(userId);

    done();
  });

  it('should make a request to get a user\'s groups', function(done) {
    var userId = 1;
    var path = 'user/' + userId + '/groups';

    mock.expects('get').withArgs(path);

    UserAPI.getGroups(userId);

    done();
  });

  it('should make a request to get a user\'s likes', function(done) {
    var userId = 1;
    var path = 'user/' + userId + '/likes';

    mock.expects('get').withArgs(path);

    UserAPI.getLikes(userId);

    done();
  });

  it('should make a request to get a user\'s stars', function(done) {
    var userId = 1;
    var path = 'user/' + userId + '/stars';

    mock.expects('get').withArgs(path);

    UserAPI.getStars(userId);

    done();
  });

  after(function() {
    mock.restore();
  });

});