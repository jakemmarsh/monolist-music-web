'use strict';

var APIUtils   = require('../../app/js/utils/APIUtils');
var ExploreAPI = require('../../app/js/utils/ExploreAPI');

describe('Util: ExploreAPI', function() {

  var mock;

  before(function() {
    mock = sinon.mock(APIUtils);
  });

  after(function() {
    mock.restore();
  });

});