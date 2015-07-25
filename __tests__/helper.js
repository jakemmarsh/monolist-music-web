'use strict';

before(function(done) {

  this.timeout(10000);

  // Ensure that 'should' library methods will be
  // available to all tests
  global.should = require('should');
  global.sinon = require('sinon');

  done();

});