'use strict';

import APIUtils from '../../app/js/utils/APIUtils';
import AuthAPI  from '../../app/js/utils/AuthAPI';

describe('Util: AuthAPI', function() {

  it('should make a request to check user\'s log-in status', function() {
    const postStub = sandbox.stub(APIUtils, 'post');
    const path = 'auth/register';
    const user = {};

    AuthAPI.register(user);

    sinon.assert.calledOnce(postStub);
    sinon.assert.calledWith(postStub, path, user);
  });

  it('should make a request to register a user', function() {
    const getStub = sandbox.stub(APIUtils, 'get');
    const path = 'auth/check';

    AuthAPI.check();

    sinon.assert.calledOnce(getStub);
    sinon.assert.calledWith(getStub, path);
  });

  it('should make a request to login a user', function() {
    const postStub = sandbox.stub(APIUtils, 'post');
    const path = 'auth/login';
    const user = {};

    AuthAPI.login(user);

    sinon.assert.calledOnce(postStub);
    sinon.assert.calledWith(postStub, path, user);
  });

  it('should make a request to log a user in via Facebook', function() {
    const postStub = sandbox.stub(APIUtils, 'post');
    const path = 'auth/login/facebook';
    const user = {};

    AuthAPI.facebookLogin(user);

    sinon.assert.calledOnce(postStub);
    sinon.assert.calledWith(postStub, path, user);
  });

  it('should make a request to initiate forgotten password flow', function() {
    const postStub = sandbox.stub(APIUtils, 'post');
    const username = 'test';
    const path = `auth/forgot/${username}`;

    AuthAPI.forgotPassword(username);

    sinon.assert.calledOnce(postStub);
    sinon.assert.calledWith(postStub, path);
  });

  it('should make a request to reset a forgotten password', function() {
    const postStub = sandbox.stub(APIUtils, 'post');
    const userId = 2;
    const resetKey = 'abcdefg';
    const password = 'test';
    const path = `auth/reset/${userId}/${resetKey}`;

    AuthAPI.resetPassword(userId, resetKey, password);

    sinon.assert.calledOnce(postStub);
    sinon.assert.calledWith(postStub, path, { password: password });
  });

  it('should make a request to log a user out', function() {
    const postStub = sandbox.stub(APIUtils, 'post');
    const path = 'auth/logout';

    AuthAPI.logout();

    sinon.assert.calledOnce(postStub);
    sinon.assert.calledWith(postStub, path);
  });

});
