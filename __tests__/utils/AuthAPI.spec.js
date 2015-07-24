'use strict';

var APIUtils = require('../../app/js/utils/APIUtils');
var AuthAPI  = require('../../app/js/utils/AuthAPI');

describe('Util: AuthAPI', function() {

  var mock;

  before(function() {
    mock = sinon.mock(APIUtils);
  });

  it('should make a request to check user\'s log-in status', function(done) {
    var path = 'auth/register';
    var user = {};

    mock.expects('post').withArgs(path, user);

    AuthAPI.register(user);

    done();
  });

  it('should make a request to register a user', function(done) {
    var path = 'auth/check';

    mock.expects('get').withArgs(path);

    AuthAPI.check();

    done();
  });

  it('should make a request to login a user', function(done) {
    var path = 'auth/login';
    var user = {};

    mock.expects('post').withArgs(path, user);

    AuthAPI.login(user);

    done();
  });

  it('should make a request to log a user in via Facebook', function(done) {
    var path = 'auth/login/facebook';
    var user = {};

    mock.expects('post').withArgs(path, user);

    AuthAPI.facebookLogin(user);

    done();
  });

  it('should make a request to initiate forgotten password flow', function(done) {
    var username = 'test';
    var path = 'auth/forgot/' + username;

    mock.expects('post').withArgs(path);

    AuthAPI.forgotPassword(username);

    done();
  });

  it('should make a request to reset a forgotten password', function(done) {
    var userId = 2;
    var resetKey = 'abcdefg';
    var password = 'test';
    var path = 'auth/reset/' + userId + '/' + resetKey;

    mock.expects('post').withArgs(path, { password: password });

    AuthAPI.resetPassword(userId, resetKey, password);

    done();
  });

  it('should make a request to log a user out', function(done) {
    var path = 'auth/logout';
    var user = {};

    mock.expects('post').withArgs(path);

    AuthAPI.logout();

    done();
  });

  after(function() {
    mock.restore();
  });

});