'use strict';

var APIUtils = require('./APIUtils');

var AuthAPI = {

  register: function(user) {
    return APIUtils.post('auth/register', user);
  },

  check: function() {
    return APIUtils.get('auth/check');
  },

  login: function(user) {
    return APIUtils.post('auth/login', user);
  },

  facebookLogin: function(user) {
    return APIUtils.post('auth/login/facebook', user);
  },

  forgotPassword: function(username) {
    return APIUtils.post('auth/forgot/' + username);
  },

  resetPassword: function(userId, resetKey, password) {
    return APIUtils.post('auth/reset/' + userId + '/' + resetKey, { password: password });
  },

  logout: function() {
    return APIUtils.post('auth/logout');
  }

};

module.exports = AuthAPI;