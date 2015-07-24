'use strict';

var APIUtils = require('../../app/js/utils/APIUtils');
var GroupAPI = require('../../app/js/utils/GroupAPI');

describe('Util: GroupAPI', function() {

  var mock;

  before(function() {
    mock = sinon.mock(APIUtils);
  });

  after(function() {
    mock.restore();
  });

});