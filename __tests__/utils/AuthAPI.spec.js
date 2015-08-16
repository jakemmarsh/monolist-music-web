'use strict';

import APIUtils from '../../app/js/utils/APIUtils';
import AuthAPI  from '../../app/js/utils/AuthAPI';

describe('Util: AuthAPI', function() {

  beforeEach(function() {
    this.apiUtilsMock = sandbox.mock(APIUtils);
  });

  it('should make a request to check user\'s log-in status', function(done) {
    let path = 'auth/register';
    let user = {};

    this.apiUtilsMock.expects('post').withArgs(path, user);

    AuthAPI.register(user);

    done();
  });

  it('should make a request to register a user', function(done) {
    let path = 'auth/check';

    this.apiUtilsMock.expects('get').withArgs(path);

    AuthAPI.check();

    done();
  });

  it('should make a request to login a user', function(done) {
    let path = 'auth/login';
    let user = {};

    this.apiUtilsMock.expects('post').withArgs(path, user);

    AuthAPI.login(user);

    done();
  });

  it('should make a request to log a user in via Facebook', function(done) {
    let path = 'auth/login/facebook';
    let user = {};

    this.apiUtilsMock.expects('post').withArgs(path, user);

    AuthAPI.facebookLogin(user);

    done();
  });

  it('should make a request to initiate forgotten password flow', function(done) {
    let username = 'test';
    let path = 'auth/forgot/' + username;

    this.apiUtilsMock.expects('post').withArgs(path);

    AuthAPI.forgotPassword(username);

    done();
  });

  it('should make a request to reset a forgotten password', function(done) {
    let userId = 2;
    let resetKey = 'abcdefg';
    let password = 'test';
    let path = 'auth/reset/' + userId + '/' + resetKey;

    this.apiUtilsMock.expects('post').withArgs(path, { password: password });

    AuthAPI.resetPassword(userId, resetKey, password);

    done();
  });

  it('should make a request to log a user out', function(done) {
    let path = 'auth/logout';

    this.apiUtilsMock.expects('post').withArgs(path);

    AuthAPI.logout();

    done();
  });

  afterEach(function() {
    this.apiUtilsMock.restore();
  });

});