'use strict';

import APIUtils from './APIUtils';

var AuthAPI = {

  register(user) {
    return APIUtils.post('auth/register', user);
  },

  check() {
    return APIUtils.get('auth/check');
  },

  login(user) {
    return APIUtils.post('auth/login', user);
  },

  facebookLogin(user) {
    return APIUtils.post('auth/login/facebook', user);
  },

  forgotPassword(username) {
    return APIUtils.post('auth/forgot/' + username);
  },

  resetPassword(userId, resetKey, password) {
    return APIUtils.post('auth/reset/' + userId + '/' + resetKey, { password: password });
  },

  logout() {
    return APIUtils.post('auth/logout');
  }

};

export default AuthAPI;